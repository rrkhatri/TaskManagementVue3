<script setup>
import {computed, reactive, ref} from "vue";
import {useTaskStore} from "@/stores/task.js";
import Modal from "@/components/utils/Modal.vue";
import {useToast} from "vue-toastification";

const toast = useToast();
const taskStore = useTaskStore();
const emit = defineEmits(['updated']);

const editModalVisible = ref(false);
const task = reactive({
  id: '',
  title: '',
  description: '',
  category: '',
  status: '',
  due_at: ''
});

const openEditModal = (taskObj) => {
  setTask(taskObj);

  editModalVisible.value = true
}

const updateTask = () => {
  taskStore.updateTask(task)
      .then(response => {
        editModalVisible.value = false;
        setTask();
        emit('updated');

        toast.success("Task updated successfully", {
          timeout: 2000
        })
      })
      .catch(error => {
        toast.error("Fix validation errors", {
          timeout: 2000
        })
      });
}

const setTask = (taskObj) => {
  task.id = taskObj.id ?? '';
  task.title = taskObj.title ?? '';
  task.description = taskObj.description ?? '';
  task.category = taskObj.category ?? '';
  task.status = taskObj.status ?? '';
  task.due_at = taskObj.due_at ?? '';
}

const hasError = computed(() => {
  return (key) => !!taskStore.errors?.[key];
});
const getError = computed(() => {
  return (key) => taskStore.errors?.[key]?.[0];
});

defineExpose({
  openEditModal
})
</script>

<template>
  <Modal :show="editModalVisible" @close="editModalVisible = false" maxWidth="md">
    <template #header>
      <h2 class="font-bold text-lg">Update Task</h2>
    </template>

    <template #body>
      <div class="space-y-4">
        <div>
          <label for="title" class="block text-sm/6 font-medium text-gray-900">Title</label>
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
          <label for="category" class="block text-sm/6 font-medium text-gray-900">Category</label>
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
          <label for="status" class="block text-sm/6 font-medium text-gray-900">Status</label>
          <select
              name="status"
              id="status"
              v-model="task.status" required
              class="block w-full h-8 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          >
            <option value="" disabled>Select a status</option>
            <option v-for="taskStatus in taskStore.statuses" :value="taskStatus.value">{{ taskStatus.name }}</option>
          </select>

          <p class="text-sm/6 text-red-500" v-show="hasError('status')">
            {{ getError('status') }}
          </p>
        </div>

        <div>
          <label for="due_at" class="block text-sm/6 font-medium text-gray-900">Deadline</label>
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
          @click.prevent="updateTask()"
          class="cursor-pointer flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Save
      </button>
    </template>
  </Modal>
</template>

<style scoped>

</style>
