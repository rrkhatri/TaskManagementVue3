import { createRouter, createWebHistory } from 'vue-router'
import {useAuthenticationStore} from "@/stores/authentication";

const router = createRouter({
  linkExactActiveClass: 'border-b border-indigo-500',
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: () => import("@/layouts/MainLayout.vue"),
      meta: {
        middleware: "guest",
      },
      children: [
        {
          path: "/",
          name: "sign-in",
          component: () => import("@/components/auth/Login.vue"),
          meta: {
            pageTitle: "SignIn",
          },
        },
        {
          path: '/register',
          name: 'register',
          component: () => import("@/components/auth/Register.vue"),
          meta: {
            pageTitle: "Register",
          },
        }
      ],
    },
    {
      path: '/tasks',
      component: () => import("@/layouts/MainLayout.vue"),
      meta: {
        middleware: "auth",
      },
      children: [
        {
          path: '/',
          name: 'tasks',
          component: () => import("@/components/task/List.vue"),
          meta: {
            pageTitle: "Tasks",
          },
        }
      ]
    },
    {
      path: "/:pathMatch(.*)*",
      component: () => import("@/layouts/MainLayout.vue"),
      children: [
        {
          path: "/:pathMatch(.*)*",
          name: "404",
          component: () => import("@/views/404.vue"),
          meta: {
            pageTitle: "404",
          },
        }
      ]
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthenticationStore();

  document.title = `${to.meta.pageTitle} - ${import.meta.env.VITE_APP_NAME}`;

  // verify auth token before each page change
  authStore.verifyAuth();

  switch (to.meta.middleware) {
    case "guest":
      if (authStore.isAuthenticated) {
        next({ name: "tasks" });
        return;
      }
      break;

    case "auth":
      if (!authStore.isAuthenticated) {
        next({ name: "login" });
        return;
      }
      break;
  }

  next();

  // Scroll page to top on every route change
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

export default router
