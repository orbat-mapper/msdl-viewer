<script setup lang="ts">
import maplibregl, { GeoJSONSource, Map as MlMap } from "maplibre-gl";
import { type ForceSide, MilitaryScenario } from "@orbat-mapper/msdllib";
import ms from "milsymbol";
import { computed, watch } from "vue";
import { sortBy } from "@/utils.ts";
import { useLayerStore } from "@/stores/layerStore.ts";
const store = useLayerStore();
const props = defineProps<{ mlMap: MlMap; scenario: MilitaryScenario }>();

const sides = computed(() => {
  return sortBy(props.scenario.sides ?? [], "name").filter((side) => side.rootUnits.length > 0);
});

watch(store.layers, () => {
  console.log(store.layers);
  const source = props.mlMap.getSource("sides") as GeoJSONSource;
  if (!source) return;
  const visibleSides = sides.value.filter((side) => store.layers.has(side.objectHandle));
  source.setData(combineSidesToJson(visibleSides) as never);
});

function combineSidesToJson(sides: ForceSide[]) {
  return {
    type: "FeatureCollection",
    features: sides.map((side) => side.toGeoJson().features).flat(),
  };
}

function addSidesToMap(map: MlMap) {
  map.addSource("sides", {
    type: "geojson",
    data: combineSidesToJson(sides.value) as never,
  });

  map.on("styleimagemissing", function (e) {
    const symb = new ms.Symbol(e.id, { size: 20 });
    const { width, height } = symb.getSize();
    const data = symb
      .asCanvas(2)
      ?.getContext("2d")
      ?.getImageData(0, 0, 2 * width, 2 * height);
    if (data) {
      map.addImage(e.id, data, { pixelRatio: 2 });
    }
  });

  map.addLayer({
    id: "sides",
    type: "symbol",
    source: "sides",
    layout: {
      "icon-image": ["get", "sidc"],
      // "text-field": ["get", "label"],
      "text-font": ["Noto Sans Italic"],
      "text-offset": [0, 1.25],
      "text-anchor": "top",
      "text-size": 12,
      "icon-allow-overlap": true,
      // "text-allow-overlap": true,
    },
  });

  // When a click event occurs on a feature in the places layer, open a popup at the
  // location of the feature, with description HTML from its properties.
  map.on("click", "sides", (e) => {
    if (!e.features) return;

    if (e.features[0].geometry.type !== "Point") {
      return;
    }
    const coordinates = e.features[0].geometry.coordinates.slice();
    const labels = e.features.map((f) => f.properties.label).join(", ");

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new maplibregl.Popup({ className: "text-black" })
      .setLngLat(coordinates as [number, number])
      .setText(labels)
      .addTo(map);
  });

  // Change the cursor to a pointer when the mouse is over the places layer.
  map.on("mouseenter", "sides", () => {
    map.getCanvas().style.cursor = "pointer";
  });

  // Change it back to a pointer when it leaves.
  map.on("mouseleave", "sides", () => {
    map.getCanvas().style.cursor = "";
  });
}

addSidesToMap(props.mlMap);
</script>
