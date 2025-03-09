<script setup>
import {ref} from "vue";
import {useTaskStore} from "@/stores/task.js";
import Modal from "@/components/utils/Modal.vue";
import {useToast} from "vue-toastification";

const toast = useToast();
const taskStore = useTaskStore();
const emit = defineEmits(['deleted']);

const deleteModalVisible = ref(false);
const taskId = ref();

const openDeleteModal = (currentTaskId) => {
  taskId.value = currentTaskId;

  deleteModalVisible.value = true
}

const deleteTask = () => {
  taskStore.deleteTask(taskId.value)
      .then(response => {
        deleteModalVisible.value = false;
        emit('deleted');
        toast.success("Task deleted successfully", {
          timeout: 2000
        })
      })
      .catch(error => {
        toast.error("Fix validation errors", {
          timeout: 2000
        })
      });
}

defineExpose({
  openDeleteModal
})
</script>

<template>
  <Modal :show="deleteModalVisible" @close="deleteModalVisible = false" maxWidth="md">
    <template #header>
      <h2 class="font-bold text-lg">Delete Task</h2>
    </template>

    <template #body>
      <p>Are you sure to delete selected task?</p>
    </template>

    <template #footer>
      <button
          @click.prevent="deleteTask()"
          class="cursor-pointer flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Delete
      </button>
    </template>
  </Modal>
</template>

<style scoped>

</style>
