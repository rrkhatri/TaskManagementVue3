<script setup>
import { useTaskStore } from "@/stores/task.js";
import {onMounted, reactive, ref, useTemplateRef, watch} from "vue";
import AddTask from "@/components/task/Create.vue";
import EditTask from "@/components/task/Edit.vue";
import DeleteTask from "@/components/task/Delete.vue";
import Pagination from "@/components/utils/Pagination.vue";

const taskStore = useTaskStore();
const openDropdownId = ref();
const filters = reactive({
  sort: {
    field: 'created_at',
    direction: 'desc'
  },
  filter: {
    category: '',
    status: ''
  },
  page: 1,
  per_page: 15
})
const addTaskComponent = useTemplateRef('addTaskComponent');
const editTaskComponent = useTemplateRef('editTaskComponent');
const deleteTaskComponent = useTemplateRef('deleteTaskComponent');

onMounted(() => {
  taskStore.fetchTasks(filters);
})

const toggleDropdown = (taskId) => {
  openDropdownId.value = openDropdownId.value === taskId ? null : taskId;
}

const closeDropdown = () => {
  openDropdownId.value = null;
}

const isCompleted = (task) => {
  return task.status === 'completed';
}

watch(() => [
  filters.page,
  filters.sort.direction,
  filters.filter.category,
  filters.filter.status,
], (
    [newPage, newSort, newCategory, newStatus],
    [oldPage, oldSort, oldCategory, oldStatus]
) => {
  if (
      oldSort != newSort ||
      oldCategory != newCategory ||
      oldStatus != newStatus
  ) {
    filters.page = 1;
  }

  taskStore.fetchTasks(filters)
});
</script>

<template>
  <div class="w-full bg-white rounded-lg shadow-lg h-full space-y-6">
    <div class="px-4 pt-6 md:px-8 xl:px-10">
      <div class="flex items-center justify-between">
        <p tabindex="0" class="focus:outline-none text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-normal text-gray-800">
          Tasks
        </p>

        <div class="flex space-x-2">
          <div class="py-2 px-3 flex items-center text-sm font-medium leading-none border border-gray-300 text-gray-600 rounded-lg">
            <p>Sort By:</p>
            <select aria-label="select" class="cursor-pointer focus:text-indigo-600 focus:outline-none bg-transparent ml-1" v-model="filters.sort.direction">
              <option class="text-sm text-indigo-800" value="desc">Latest</option>
              <option class="text-sm text-indigo-800" value="asc">Oldest</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white pb-4 px-4 md:px-8 xl:px-10">
      <div class="flex items-center justify-between">
        <div class="sm:flex sm:space-x-4 sm:space-y-0 space-x-0 space-y-2  w-full sm:w-auto">
          <div class="sm:flex items-center text-sm font-medium leading-none text-gray-600">
            <label for="status">Status:</label>
            <select
                aria-label="select"
                class="py-0.5 px-1 text-xs border rounded-xl text-indigo-600 outline-none ml-1 cursor-pointer"
                v-model="filters.filter.status"
            >
              <option value="">All</option>
              <option v-for="status in taskStore.statuses" class="text-sm text-indigo-800" :value="status.value">
                {{ status.name }}
              </option>
            </select>
          </div>

          <div class="sm:flex items-center text-sm font-medium leading-none text-gray-600">
            <label for="category">Category:</label>
            <select
                aria-label="select"
                class="py-0.5 px-1 text-xs border rounded-xl text-indigo-600 outline-none ml-1 cursor-pointer"
                v-model="filters.filter.category"
            >
              <option value="">All</option>
              <option v-for="category in taskStore.categories" class="text-sm text-indigo-800" :value="category.value">
                {{ category.name }}
              </option>
            </select>
          </div>
        </div>

        <button @click="addTaskComponent.openCreateModal()" class="cursor-pointer focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 inline-flex items-start justify-start px-4 py-3 bg-indigo-700 hover:bg-indigo-600 focus:outline-none rounded">
          <p class="text-sm font-medium leading-none text-white">+ Task</p>
        </button>
      </div>

      <div class="mt-4 overflow-x-auto h-full">
        <table class="not-md:hidden w-full whitespace-nowrap">
          <tbody>
          <tr
              v-for="task in taskStore.tasks"
              tabindex="0"
              class="focus:outline-none h-16 border border-gray-100 rounded"
          >
            <td>
              <div class="py-3 items-center space-y-2">
                <p class="text-base font-medium leading-none text-gray-700 pl-3">{{ task.title }}</p>
                <p class="text-xs leading-none text-gray-400 max-w-2xl text-wrap pl-3">{{ task.description }}</p>
              </div>
            </td>

            <td class="pl-5">
              <div class="flex items-center">
                <span :class="`text-black fa-regular text-xs ${taskStore.getCategoryIcon(task.category)}`"></span>
                <p class="text-sm leading-none text-gray-600 ml-2">{{ taskStore.getCategory(task.category) }}</p>
              </div>
            </td>

            <td class="pl-5">
              <div :class="`text-center text-xs rounded-full py-0.5 px-1 ${taskStore.getStatusColor(task.status)}`">
                {{ taskStore.getStatus(task.status) }}
              </div>
            </td>

            <td class="pl-5">
              <button
                  class="py-1 px-1.5 text-xs focus:outline-none leading-none rounded"
                  :class="{'text-red-700 bg-red-100': task.is_due, 'text-gray-700 bg-gray-100': !task.is_due}"
              >
                Due at {{ task.due_at }}
              </button>
            </td>

            <td>
              <div class="relative px-5">
                <button
                    class="cursor-pointer focus:ring-2 rounded-md focus:outline-none w-5"
                    :id="`task-${task.id}`"
                    role="button"
                    aria-label="option"
                    @click="toggleDropdown(task.id)"
                >
                  <i class="fa-solid fa-ellipsis-vertical text-gray-500"></i>
                </button>
              </div>

              <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                <div
                    v-if="openDropdownId === task.id"
                    class="absolute -ml-24 origin-top-right bg-white shadow w-36 z-10 rounded-md opacity-100"
                    role="menu"
                    aria-orientation="vertical"
                    :aria-labelledby="`task-${task.id}`"
                    tabindex="0"
                >
                  <div class="py-1 shadow-lg" role="none">
                    <div
                        role="menuitem"
                        tabindex="0"
                        class="text-black focus:outline-none focus:text-indigo-600 text-xs w-full hover:bg-indigo-700 py-2 px-4 cursor-pointer hover:text-white"
                        @click="() => { closeDropdown(); taskStore.toggleComplete(task.id) }"
                    >
                      Mark as {{ isCompleted(task) ? 'Pending' : 'Completed' }}
                    </div>

                    <div
                        role="menuitem"
                        tabindex="0"
                        class="text-black focus:outline-none focus:text-indigo-600 text-xs w-full hover:bg-indigo-700 py-2 px-4 cursor-pointer hover:text-white"
                        @click="() => { closeDropdown(); editTaskComponent.openEditModal(task) }"
                    >
                      Edit
                    </div>

                    <div
                        role="menuitem"
                        tabindex="0"
                        class="text-black focus:outline-none focus:text-indigo-600 text-xs w-full hover:bg-indigo-700 py-2 px-4 cursor-pointer hover:text-white"
                        @click="() => { closeDropdown(); deleteTaskComponent.openDeleteModal(task.id) }"
                    >
                      Delete
                    </div>
                  </div>
                </div>
              </transition>
            </td>
          </tr>
          </tbody>
        </table>

        <div v-for="task in taskStore.tasks" tabindex="0" class="md:hidden">
          <div class="rounded-lg border border-gray-300 divide-y divide-gray-200 mb-2">
            <div class="p-5 flex items-center">
              <div>
                <p class="text-gray-900 text-lg">{{ task.title }}</p>
                <p class="text-gray-500 text-sm">{{ task.description }}</p>
              </div>

              <div class="ml-auto">
                <div class="relative inline-block text-left">
                  <div>
                    <button @click="toggleDropdown(task.id)" class="cursor-pointer inline-flex w-full justify-center gap-x-1.5 bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-gray-300 ring-inset hover:bg-gray-50" id="menu-button" aria-expanded="true" aria-haspopup="true">
                      <i class="fa-solid fa-ellipsis-vertical text-gray-500"></i>
                    </button>
                  </div>

                  <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                    <div v-if="openDropdownId === task.id" class="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                      <div class="py-1" role="none">
                        <div
                            role="menuitem"
                            tabindex="0"
                            class="text-black focus:outline-none focus:text-indigo-600 text-xs w-full hover:bg-indigo-700 py-2 px-4 cursor-pointer hover:text-white"
                            @click="() => { closeDropdown(); taskStore.toggleComplete(task.id) }"
                        >
                          Mark as {{ isCompleted(task) ? 'Pending' : 'Completed' }}
                        </div>

                        <div
                            role="menuitem"
                            tabindex="0"
                            class="text-black focus:outline-none focus:text-indigo-600 text-xs w-full hover:bg-indigo-700 py-2 px-4 cursor-pointer hover:text-white"
                            @click="() => { closeDropdown(); editTaskComponent.openEditModal(task) }"
                        >
                          Edit
                        </div>

                        <div
                            role="menuitem"
                            tabindex="0"
                            class="text-black focus:outline-none focus:text-indigo-600 text-xs w-full hover:bg-indigo-700 py-2 px-4 cursor-pointer hover:text-white"
                            @click="() => { closeDropdown(); deleteTaskComponent.openDeleteModal(task.id) }"
                        >
                          Delete
                        </div>
                      </div>
                    </div>
                  </transition>
                </div>
              </div>
            </div>

            <div class="px-5 py-3 divide-y divide-gray-100">
              <div class="py-2 flex items-center justify-between">
                <div class="text-black text-sm">
                  Category:
                </div>
                <div class="text-sm">
                  <span><i :class="`fa-regular ${taskStore.getCategoryIcon(task.category)}`"></i></span>
                  {{ taskStore.getCategory(task.category) }}
                </div>
              </div>

              <div class="py-2 flex items-center justify-between">
                <div class="text-black text-sm">
                  Status:
                </div>
                <div :class="`text-center text-xs rounded-full py-0.5 px-1 ${taskStore.getStatusColor(task.status)}`">
                  {{ taskStore.getStatus(task.status) }}
                </div>
              </div>

              <div class="py-2 flex items-center justify-between">
                <div class="text-black text-sm">
                  Due at:
                </div>
                <div class="text-sm">
                  <button
                      class="py-1 px-1.5 text-xs focus:outline-none leading-none rounded"
                      :class="{'text-red-700 bg-red-100': task.is_due, 'text-gray-700 bg-gray-100': !task.is_due}"
                  >
                    Due at {{ task.due_at }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
            v-if="taskStore.tasks && !taskStore.tasks.length"
            class="text-gray-400 flex justify-center mt-8 text-xl"
        >
          No tasks found
        </div>
      </div>

      <Pagination
          v-model:current-page="filters.page"
          :meta="taskStore.meta"
          class="mt-2"
      />
    </div>

    <AddTask
        @created="taskStore.fetchTasks(filters)"
        ref="addTaskComponent"
    />

    <EditTask
        @updated="taskStore.fetchTasks(filters)"
        ref="editTaskComponent"
    />

    <DeleteTask
        @deleted="taskStore.fetchTasks(filters)"
        ref="deleteTaskComponent"
    />
  </div>
</template>

<style scoped>
.checkbox:checked + .check-icon {
  display: flex;
}
</style>
