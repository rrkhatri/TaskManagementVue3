import { defineStore } from 'pinia';
import ApiService from "@/core/services/ApiService.js";

export const useTaskStore = defineStore('task',  {
  state: () => ({
    tasks: [],
    errors: [],
    meta: {
      current_page: 1,
      last_page: 1,
      total: 0,
      from: 0,
      to: 0
    },
    categories: [
      {
        name: 'Personal',
        value: 'personal',
        icon: 'fa-user'
      },
      {
        name: 'Work',
        value: 'work',
        icon: 'fa-briefcase'
      },
      {
        name: 'Urgent',
        value: 'urgent',
        icon: 'fa-triangle-exclamation'
      }
    ],
    statuses: [
      {
        name: 'Pending',
        value: 'pending',
        color: 'text-yellow-500 bg-yellow-100 border border-yellow-300'
      },
      {
        name: 'In Progress',
        value: 'in-progress',
        color: 'text-blue-500 bg-blue-100 border border-blue-300'
      },
      {
        name: 'Completed',
        value: 'completed',
        color: 'text-green-500 bg-green-100 border border-green-300'
      }
    ],
  }),
  getters: {
    getCategory(state) {
      return (category) => state.categories.find(cat => cat.value === category).name ?? '';
    },
    getCategoryIcon(state) {
      return (category) => state.categories.find(cat => cat.value === category).icon ?? '';
    },
    getStatus(state) {
      return (status) => state.statuses.find(st => st.value === status).name ?? '';
    },
    getStatusColor(state) {
      return (status) => state.statuses.find(st => st.value === status).color ?? '';
    }
  },
  actions: {
    fetchTasks(filters = null) {
      return new Promise((resolve, reject) => {
        ApiService.get('tasks', {params: filters})
            .then((response) => {
              this.tasks = response.data.data;
              this.meta = response.data.meta;
              resolve(response)
            })
            .catch((error) => {
              this.setError(error.response?.data?.errors);
              reject(error)
            });
      });
    },
    createTask(task) {
      return new Promise((resolve, reject) => {
        ApiService.post('tasks', task)
          .then((response) => {
            resolve(response)
          })
          .catch((error) => {
            this.setError(error.response?.data?.errors);
            reject(error)
          });
      });
    },
    updateTask(task) {
      return new Promise((resolve, reject) => {
        ApiService.put(`tasks/${task.id}`, task)
            .then((response) => {
              this.tasks = this.tasks.map(t => t.id === task.id ? response.data.data : t);
              resolve(response)
            })
            .catch((error) => {
              this.setError(error.response?.data?.errors);
              reject(error)
            });
      });
    },
    deleteTask(taskId) {
      return new Promise((resolve, reject) => {
        ApiService.delete(`tasks/${taskId}`)
            .then((response) => {
              this.tasks = this.tasks.filter(task => task.id !== taskId)
              resolve(response)
            })
            .catch((error) => {
              this.setError(error.response?.data?.errors);
              reject(error)
            });
      });
    },
    toggleComplete(taskId) {
      return new Promise((resolve, reject) => {
        const task = this.tasks.find(task => task.id === taskId);
        task.status = task.status === "completed" ? "pending" : "completed";

        this.updateTask(task)
            .then((response) => resolve(response))
            .catch((error) => reject(error));
      });
    },
    setError(error) {
      this.errors = { ...error };
    }
  }
});
