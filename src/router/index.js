import { createRouter, createWebHistory } from 'vue-router';
import { supabase } from '@/supabase';

import LoginView from '@/views/LoginView.vue';
import SignupView from '@/views/SignupView.vue';
import Account from '@/components/Account.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/user',
      name: 'user',
      component: Account,
      meta: {
        auth: true,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
    },
    {
      path: '/:notFound(.*)',
      name: 'notFound',
      redirect: '/user',
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const requiresAuth = to.matched.some((record) => record.meta.auth);

  if (requiresAuth && !user) next('login');
  else if (!requiresAuth && user) next('user');
  else next();
});

export default router;
