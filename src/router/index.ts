import { isUserLoggedIn } from '@/router/utils';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/login' },
    {
      path: '/',
      component: () => import('../layouts/default.vue'),
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          meta: { requiresAuth: true },
          component: () => import('../pages/dashboard.vue'),
        },
        {
          path: 'account-settings',
          meta: { requiresAuth: true },
          component: () => import('../pages/account-settings.vue'),
        },
        {
          path: 'users',
          meta: { requiresAuth: true },
          component: () => import('../views/Users/index.vue'),
        },
        {
          path: 'user/contracts/:id',
          component: () => import('../components/Users/components/contractsList.vue'),
        },
        // {
        //   path: 'icons',
        //   component: () => import('../pages/icons.vue'),
        // },
        // {
        //   path: 'cards',
        //   component: () => import('../pages/cards.vue'),
        // },
        // {
        //   path: 'tables',
        //   component: () => import('../pages/tables.vue'),
        // },
        // {
        //   path: 'form-layouts',
        //   component: () => import('../pages/form-layouts.vue'),
        // },
      ],
    },
    {
      path: '/',
      component: () => import('../layouts/blank.vue'),
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('../pages/login.vue'),
        },
        {
          path: 'register',
          component: () => import('../pages/register.vue'),
        },
        {
          path: 'forgot-password',
          name: 'forgot-password',
          component: () => import('../pages/forgot-password.vue'),
        },
        {
          path: 'verification-codes',
          name: 'verification-codes',
          component: () => import('../pages/verification-codes.vue'),
        },
        {
          path: 'reset-password',
          name: 'reset-password',
          component: () => import('../pages/reset-password.vue'),
        },
        {
          path: '/:pathMatch(.*)*',
          component: () => import('../pages/[...all].vue'),
        },

      ],
    },
    // ...setupLayouts(routes),
  ],
})
router.beforeEach((to, from, next) => {
  const isLoggedIn = isUserLoggedIn()

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (isLoggedIn) {
      next();
      return;
    }
    next("/");
  } else {
    next();
  }
});

export default router
