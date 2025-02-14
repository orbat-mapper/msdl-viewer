<script setup lang="ts">
import { MilitaryScenario } from "@orbat-mapper/msdllib";
import { ref } from "vue";

const msdl = ref<MilitaryScenario>();
async function getData() {
  const url = "MSDL-example.xml";
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
</script>
<template>
  <main v-if="msdl">
    <p>Welcome</p>

    <ul>
      <li v-for="side in msdl.sides" :key="side.name">
        {{ side.name }}
        <ul>
          <li v-for="unit in side.rootUnits" :key="unit.name" class="pl-4">
            {{ unit.name }}
            <ul>
              <li v-for="subunit in unit.subordinates" :key="subunit.name" class="pl-4">
                {{ subunit.name }}
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
    <pre>{{ msdl.sides[0].name }}</pre>
  </main>
</template>
