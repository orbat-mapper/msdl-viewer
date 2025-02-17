<script setup lang="ts">
import { MilitaryScenario } from "@orbat-mapper/msdllib";
import { computed, ref, shallowRef } from "vue";
import { sortBy } from "@/utils.ts";
import SidePanel from "@/components/SidePanel.vue";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import MaplibreMap from "@/components/MaplibreMap.vue";
import MapLogic from "@/components/MapLogic.vue";

const mlMap = shallowRef<maplibregl.Map>();

const msdl = ref<MilitaryScenario>();
async function getData() {
  const url = "/examples/MSDL-example.xml";
  // const url = "/examples/SampleMSDL.xml";
  // const url = "/examples/example3.xml";
  try {
    const response = await fetch(url);
    const msdlAsText = await response.text();
    msdl.value = MilitaryScenario.createFromString(msdlAsText);
    msdl.value.primarySide = msdl.value.sides[2];
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

getData();

const sides = computed(() => {
  return sortBy(msdl.value?.sides ?? [], "name").filter((side) => side.rootUnits.length > 0);
});

function onMapReady(map: maplibregl.Map) {
  mlMap.value = map;
  // for (const side of sides.value) {
  //   map.addSource(side.objectHandle, {
  //     type: "geojson",
  //     data: side.toGeoJson(),
  //   });
  //   map.addLayer({
  //     id: side.objectHandle,
  //     type: "symbol",
  //     source: side.objectHandle,
  //     layout: {
  //       "icon-image": ["get", "sidc"],
  //       "text-field": ["get", "label"],
  //       "text-font": ["Noto Sans Italic"],
  //       "text-offset": [0, 1.25],
  //       "text-anchor": "top",
  //       "text-size": 12,
  //       "icon-allow-overlap": true,
  //       "text-allow-overlap": true,
  //     },
  //   });
  //   map.on("click", side.objectHandle, (e) => {
  //     if (!e.features) return;
  //     const coordinates = e.features[0].geometry.coordinates.slice();
  //     const labels = e.features.map((f) => f.properties.label).join(", ");
  //
  //     // Ensure that if the map is zoomed out such that multiple
  //     // copies of the feature are visible, the popup appears
  //     // over the copy being pointed to.
  //     while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
  //       coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  //     }
  //
  //     new maplibregl.Popup({ className: "text-black" })
  //       .setLngLat(coordinates)
  //       .setText(labels)
  //       .addTo(map);
  //   });
  // }
  // map.addSource("sides", {
  //   type: "geojson",
  //   data: combineSidesToJson(sides.value),
  // });
}
</script>
<template>
  <main class="h-full w-full flex">
    <SidePanel :sides="sides" class="w-96 px-2 border rounded-md ml-2 flex-none hidden sm:block" />
    <div id="map" class="flex-auto h-full">
      <MaplibreMap @ready="onMapReady" />
    </div>
    <MapLogic v-if="mlMap && msdl" :mlMap="mlMap" :scenario="msdl" />
  </main>
</template>
