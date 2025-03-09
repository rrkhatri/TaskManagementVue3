<script setup>
import { useRouter } from "vue-router";
import {useAuthenticationStore} from "@/stores/authentication.js";

const router = useRouter();
const authStore = useAuthenticationStore();

const signOut = () => {
  authStore.logout();
  router.push({ name: "sign-in" });
}
</script>

<template>
  <nav class="bg-gray-800">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="flex flex-1 sm:items-stretch sm:justify-start">
          <div class="flex shrink-0 items-center pr-4">
            <img class="h-8 w-auto" src="/tasks.png" alt="tasks">
          </div>

          <div class="sm:ml-6 sm:block">
            <div class="flex space-x-4">
              <router-link
                  v-if="!authStore.isAuthenticated"
                  :to="{ name: 'sign-in' }"
                  class="rounded-md px-3 py-2 text-sm font-medium text-gray-200 hover:bg-gray-700 hover:text-white"
              >
                Login
              </router-link>

              <router-link
                  v-if="!authStore.isAuthenticated"
                  :to="{ name: 'register' }"
                  class="rounded-md px-3 py-2 text-sm font-medium text-gray-200 hover:bg-gray-700 hover:text-white"
              >
                Register
              </router-link>

              <router-link
                  v-if="authStore.isAuthenticated"
                  :to="{ name: 'tasks' }"
                  class="rounded-md px-3 py-2 text-sm font-medium text-gray-200 hover:bg-gray-700 hover:text-white"
              >
                Task Manager
              </router-link>
            </div>
          </div>
        </div>

        <div class="inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <div class="ml-3">
            <button v-if="authStore.isAuthenticated" type="button" @click="signOut" class="cursor-pointer flex rounded-full text-gray-400 text-sm focus:outline-none hover:text-gray-200" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>

</style>
