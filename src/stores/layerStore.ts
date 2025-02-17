import { defineStore } from "pinia";
import { ref } from "vue";

export const useLayerStore = defineStore("visibleLayers", () => {
  const layers = ref<Set<string>>(new Set());
  const showIconAnchors = ref(false);

  return { layers, showIconAnchors };
});
