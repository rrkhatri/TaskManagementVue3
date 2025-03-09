<script setup>
import {computed, reactive, ref} from "vue";
import {useTaskStore} from "@/stores/task.js";
import Modal from "@/components/utils/Modal.vue";
import {useToast} from "vue-toastification";

const toast = useToast();
const taskStore = useTaskStore();
const emit = defineEmits(['created']);

const createModalVisible = ref(false);
const task = reactive({
  title: '',
  description: '',
  category: '',
  due_at: ''
});

const openCreateModal = () => {
  createModalVisible.value = true
}

const resetFields = () => {
  createModalVisible.value = false;
  task.title = '';
  task.description = '';
  task.category = '';
  task.due_at = '';
}

const addTask = () => {
  taskStore.createTask(task)
      .then(response => {
        resetFields();
        emit('created');

        toast.success("Task created successfully", {
          timeout: 2000
        });
      })
      .catch(error => {
        toast.error("Fix validation errors", {
          timeout: 2000
        });
      })
}

const hasError = computed(() => {
  return (key) => !!taskStore.errors?.[key];
});
const getError = computed(() => {
  return (key) => taskStore.errors?.[key]?.[0];
});

defineExpose({
  openCreateModal
})
</script>

<template>
  <Modal :show="createModalVisible" @close="createModalVisible = false" maxWidth="md">
    <template #header>
      <h2 class="font-bold text-lg">Add Task</h2>
    </template>

    <template #body>
      <div class="space-y-4">
        <div>
          <label for="title" v-required class="block text-sm/6 font-medium text-gray-900">Title</label>
          <input
              type="text"
              name="title"
              id="title"
              v-model="task.title" required
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          >

          <p class="text-sm/6 text-red-500" v-show="hasError('title')">
            {{ getError('title') }}
          </p>
        </div>

        <div>
          <label for="description" class="block text-sm/6 font-medium text-gray-900">Description</label>
          <textarea
              name="description"
              id="description"
              v-model="task.description" required
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          ></textarea>

          <p class="text-sm/6 text-red-500" v-show="hasError('description')">
            {{ getError('description') }}
          </p>
        </div>

        <div>
          <label for="category" v-required class="block text-sm/6 font-medium text-gray-900">Category</label>
          <select
              name="category"
              id="category"
              v-model="task.category" required
              class="block w-full h-8 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          >
            <option value="" disabled>Select a category</option>
            <option v-for="taskCategory in taskStore.categories" :value="taskCategory.value">{{ taskCategory.name }}</option>
          </select>

          <p class="text-sm/6 text-red-500" v-show="hasError('category')">
            {{ getError('category') }}
          </p>
        </div>

        <div>
          <label for="due_at" v-required class="block text-sm/6 font-medium text-gray-900">Deadline</label>
          <input
              type="datetime-local"
              name="due_at"
              id="due_at"
              v-model="task.due_at" required
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          >

          <p class="text-sm/6 text-red-500" v-show="hasError('due_at')">
            {{ getError('due_at') }}
          </p>
        </div>
      </div>
    </template>

    <template #footer>
      <button
          @click.prevent="addTask()"
          class="cursor-pointer flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Save
      </button>
    </template>
  </Modal>
</template>

<style scoped>

</style>
