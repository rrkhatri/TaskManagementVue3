<script setup>
import { useAuthenticationStore } from "@/stores/authentication.js";
import {computed, reactive} from "vue";
import { useRouter } from "vue-router";
import {useToast} from "vue-toastification";

const toast = useToast();
const authenticationStore = useAuthenticationStore();
const router = useRouter();
const form = reactive({
  email: "",
  name: "",
  password: "",
  password_confirmation: "",
});

const register = async (values) => {
  await authenticationStore
      .register(form)
      .then((response) => {
        toast.success("SignUp successfully", {
          timeout: 2000
        });
        router.replace({name: "tasks"})
      })
      .catch((err) => {
        toast.error("Fix validation errors", {
          timeout: 2000
        });
      });
};

const hasError = computed(() => {
  return (key) => !!authenticationStore.errors?.[key];
});
const getError = computed(() => {
  return (key) => authenticationStore.errors?.[key]?.[0];
});
</script>

<template>
  <div class="flex min-h-full flex-col justify-center items-center px-6 py-12 lg:px-8 w-full">
    <div class="w-full">
      <img src="/tasks.png" alt="logo" class="h-32 w-auto mx-auto" />
    </div>

    <div class="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-4" @submit.prevent="register">

        <div>
          <label for="name" class="block text-sm/6 font-medium text-gray-200">Name</label>
          <div class="mt-2">
            <input
                type="text"
                name="name"
                id="name" required
                v-model="form.name"
                autocomplete="name"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            >
          </div>
          <p class="text-sm/6 text-red-500" v-show="hasError('name')">
            {{ getError('name') }}
          </p>
        </div>

        <div>
          <label for="email" class="block text-sm/6 font-medium text-gray-200">Email</label>
          <div class="mt-2">
            <input
                type="email"
                name="email"
                id="email" required
                v-model="form.email"
                autocomplete="email"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            >
          </div>
          <p class="text-sm/6 text-red-500" v-show="hasError('email')">
            {{ getError('email') }}
          </p>
        </div>

        <div>
          <label for="password" class="block text-sm/6 font-medium text-gray-200">Password</label>
          <div class="mt-2">
            <input
                type="password"
                name="password"
                v-model="form.password"
                id="password" required
                autocomplete="current-password"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            >
          </div>
          <p class="text-sm/6 text-red-500" v-show="hasError('password')">
            {{ getError('password') }}
          </p>
        </div>

        <div>
          <label for="password_confirmation" class="block text-sm/6 font-medium text-gray-200">Confirm Password</label>
          <div class="mt-2">
            <input
                type="password"
                name="password_confirmation"
                v-model="form.password_confirmation"
                id="confirm_password" required
                autocomplete="current-password"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            >
          </div>
        </div>

        <div class="pt-3 flex justify-between">
          <button type="submit" class="cursor-pointer flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 mt-2 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Register
          </button>
        </div>
      </form>

      <p class="pt-4 text-center text-sm/6 text-gray-500">
        Already have an account?
        <router-link :to="{ name: 'sign-in' }" class="font-semibold text-indigo-600 hover:text-indigo-500">
          Login
        </router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>

</style>
