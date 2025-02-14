<script setup lang="ts">
import { RouterView } from "vue-router";
import { useDark, useToggle } from "@vueuse/core";
import { MoonIcon, SunIcon } from "@radix-icons/vue";
import { Button } from "@/components/ui/button";

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>

<template>
  <RouterView />
  <header class="fixed top-2 right-12">
    <div class="">
      <nav>
        <Button variant="outline" @click="toggleDark()" size="icon">
          <MoonIcon v-if="isDark" class="size-4" />
          <SunIcon v-else class="size-4" />
          <span class="sr-only">Toggle theme</span>
        </Button>
      </nav>
    </div>
  </header>
</template>
