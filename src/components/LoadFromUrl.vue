<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { computed, ref } from "vue";
import { isUrl } from "@/utils.ts";
import { MilitaryScenario } from "@orbat-mapper/msdllib";

const emit = defineEmits<{ loaded: [scenario: MilitaryScenario] }>();

const open = ref(false);
const scenarioUrl = ref("");
const isError = ref(false);
const errorMessage = ref("");
const isValidUrl = computed(() => isUrl(scenarioUrl.value));

async function fetchScenario() {
  const url = scenarioUrl.value;
  if (!isValidUrl.value) {
    isError.value = true;
    errorMessage.value = `The url ${url} is not a valid url.`;
    return;
  }
  try {
    const response = await fetch(url);
    const content = await response.text();
    const msdl = MilitaryScenario.createFromString(content);
    emit("loaded", msdl);
    open.value = false;
  } catch (e) {
    console.error("Failed to load", url);
    isError.value = true;
    errorMessage.value = `Failed to load ${url}: ${(e as Error).message}`;
  }
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button variant="outline">Load from URL</Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <form @submit.prevent="fetchScenario()">
        <DialogHeader>
          <DialogTitle>Load MSDL scenario from URL</DialogTitle>
          <DialogDescription>
            Please note that the host must be configured to allow CORS requests.
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid w-full max-w-sm items-center gap-1.5">
            <Label for="name" class=""> URL </Label>
            <Input id="name" type="text" v-model="scenarioUrl" />
          </div>
        </div>
        <p v-if="isError" class="text-sm text-destructive-foreground">
          {{ errorMessage }}
        </p>
        <DialogFooter>
          <Button type="submit">Load from URL</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
