<script setup>
import {onBeforeUnmount, onMounted} from "vue";

const emit = defineEmits(['close']);
const props = defineProps({
  show: Boolean,
  maxWidth: {
    type: String,
    default: 'xl'
  }
});

const maxWidthMappings = {
  xs: 'max-w-xs',
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl'
};

const maxWidthClass = maxWidthMappings[props.maxWidth];

const onEscape = (e) => {
  if (props.show && e.keyCode === 27) {
    emit('close');
  }
}

onMounted(() => {
  document.addEventListener('keydown', onEscape)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onEscape)
})
</script>

<template>
  <div @keyup.esc="$emit('close')" class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true" v-if="props.show">
    <transition
        name="backdrop"
        enter-active-class="ease-out duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
      <div
          class="fixed inset-0 bg-gray-800/95 transition-opacity"
          aria-hidden="true"
      ></div>
    </transition>

    <div class="fixed inset-0 z-10 w-screen h-screen overflow-y-auto">
      <div class="flex h-full my-auto justify-center p-4 text-center items-center sm:p-0">
        <transition
            name="modal-panel"
            enter-active-class="ease-out duration-300"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="ease-in duration-200"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div :class="`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full ${maxWidthClass}`">
            <div class="text-gray-900 flex w-full justify-between items-center px-4 py-3 sm:flex border-b border-gray-300">
              <slot name="header">Header</slot>

              <div class="h-6 w-6 float-end cursor-pointer opacity-50 hover:opacity-100 transition-opacity" title="close" @click="$emit('close')">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg>
              </div>
            </div>

            <div class="bg-white p-5">
              <slot name="body">Body</slot>
            </div>

            <div class="bg-gray-50 sm:flex sm:flex-row-reverse px-5 py-4">
              <slot name="footer">Buttons</slot>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
