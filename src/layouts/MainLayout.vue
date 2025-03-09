<script setup>
import TopBarComponent from "./TopComponent.vue"
</script>

<template>
  <main class="h-full flex flex-col">
    <TopBarComponent />

    <div class="lg:container mx-auto py-4 h-full" ref="mainContainer">
      <router-view />
    </div>
  </main>
</template>

<style scoped>
</style>
