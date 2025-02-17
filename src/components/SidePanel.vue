<script setup lang="ts">
import {
  Accordion,
  AccordionTrigger,
  AccordionItem,
  AccordionContent,
} from "@/components/ui/accordion";
import type { ForceSide } from "@orbat-mapper/msdllib";
import MilSymbol from "@/components/MilSymbol.vue";
import { ChevronDownIcon } from "@radix-icons/vue";
import { Switch } from "@/components/ui/switch";
import { useLayerStore } from "@/stores/layerStore.ts";
defineProps<{ sides: ForceSide[] }>();
const store = useLayerStore();

const toggleSide = (id: string) => {
  if (store.layers.has(id)) {
    store.layers.delete(id);
  } else {
    store.layers.add(id);
  }
};
</script>

<template>
  <Accordion type="multiple" class="">
    <AccordionItem v-for="side in sides" :key="side.objectHandle" :value="side.objectHandle">
      <AccordionTrigger
        ><span class="font-medium">{{ side.name }}</span>
        <template #icon>
          <div class="flex items-center gap-2">
            <Switch
              @click.stop
              :checked="store.layers.has(side.objectHandle)"
              @update:checked="toggleSide(side.objectHandle)"
            />
            <ChevronDownIcon
              class="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200"
            />
          </div>
        </template>
      </AccordionTrigger>
      <AccordionContent>
        <ul class="text-base">
          <li v-for="unit in side.rootUnits" :key="unit.name" class="pl-4">
            <span class="flex items-center gap-2"
              ><MilSymbol :sidc="unit.sidc" :size="15" /> {{ unit.name }}</span
            >
            <ul>
              <li v-for="subunit in unit.subordinates" :key="subunit.name" class="pl-4">
                <span class="flex items-center gap-2"
                  ><MilSymbol :sidc="subunit.sidc" :size="16" /> {{ subunit.label }}</span
                >
              </li>
            </ul>
          </li>
        </ul>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>
