<script setup lang="ts">
import { MilitaryScenario } from "@orbat-mapper/msdllib";
import { computed, ref, shallowRef } from "vue";
import { sortBy } from "@/utils.ts";
import SidePanel from "@/components/SidePanel.vue";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import MaplibreMap from "@/components/MaplibreMap.vue";
import MapLogic from "@/components/MapLogic.vue";
import { useLayerStore } from "@/stores/layerStore.ts";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import LoadScenarioPanel from "@/components/LoadScenarioPanel.vue";
import { useToggle } from "@vueuse/core";
import { DoubleArrowLeftIcon } from "@radix-icons/vue";
import LoadFromUrl from "@/components/LoadFromUrl.vue";

const store = useLayerStore();

const mlMap = shallowRef<maplibregl.Map>();
const [showSidebar, toggleSidebar] = useToggle(true);

const msdl = ref<MilitaryScenario>();
async function getData() {
  const url = "/examples/MSDL-example.xml";
  // const url = "/examples/SampleMSDL.xml";
  // const url = "/examples/example3.xml";
  try {
    store.layers.clear();
    const response = await fetch(url);
    const msdlAsText = await response.text();
    msdl.value = MilitaryScenario.createFromString(msdlAsText);
    msdl.value.primarySide = msdl.value.sides[2];
    msdl.value.sides.forEach((side) => {
      store.layers.add(side.objectHandle);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// getData();

function loadScenario(scenario: MilitaryScenario) {
  store.layers.clear();
  msdl.value = scenario;
  msdl.value.primarySide = msdl.value.sides[2];
  msdl.value.sides.forEach((side) => {
    store.layers.add(side.objectHandle);
  });
}

const sides = computed(() => {
  return sortBy(msdl.value?.sides ?? [], "name").filter((side) => side.rootUnits.length > 0);
});

function onMapReady(map: maplibregl.Map) {
  mlMap.value = map;
}

function toggleLayers() {
  if (store.layers.size >= sides.value.length) {
    store.layers.clear();
    return;
  }
  sides.value.forEach((side) => {
    store.layers.add(side.objectHandle);
  });
}
</script>
<template>
  <main class="h-full w-full flex">
    <aside class="w-64 sm:w-96 px-2 border rounded-md flex-none overflow-auto" v-if="showSidebar">
      <Button
        variant="outline"
        @click="toggleSidebar()"
        size="icon"
        title="Toggle sidebar"
        class="mt-2"
      >
        <DoubleArrowLeftIcon class="size-4" />
        <span class="sr-only">Toggle theme</span>
      </Button>
      <SidePanel :sides="sides" class="" />
      <div v-if="msdl">
        <h4 class="text-sm font-bold mt-2">Tools</h4>
        <div class="flex items-center space-x-2 mt-4">
          <Switch id="show-mode" v-model:checked="store.showIconAnchors" />
          <Label for="show-mode">Show icon anchors</Label>
        </div>
        <div class="mt-4">
          <Button variant="secondary" @click="toggleLayers()">Toggle layers visibility</Button>
        </div>
      </div>
      <LoadScenarioPanel class="mt-4" @loaded="loadScenario" />
      <div class="mt-4">
        <LoadFromUrl @loaded="loadScenario" />
      </div>
    </aside>
    <div id="map" class="flex-auto h-full z-0">
      <MaplibreMap @ready="onMapReady" />
    </div>
    <MapLogic v-if="mlMap && msdl" :mlMap="mlMap" :scenario="msdl" />
    <div v-if="!showSidebar" class="fixed top-2 left-2" title="Toggle sidebar">
      <Button variant="outline" @click="toggleSidebar()" size="icon">
        <DoubleArrowLeftIcon class="size-4 rotate-180" />
        <span class="sr-only">Toggle theme</span>
      </Button>
    </div>
  </main>
</template>
