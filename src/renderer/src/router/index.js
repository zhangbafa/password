import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import { isLogin,setToken } from '../utils/auth';
export const Layout = () => import("@renderer/layout/default-layout.vue");
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      // name: 'collect',
      redirect:'/collect',
      component: Layout,
      meta: {
        requiresAuth: false,
      },
      children:[{
        path:'collect',
        component:() => import('@renderer/views/dashboard/index.vue'),
        name:'collect-index',
        meta:{requiresAuth:false,type:'collect'}
      }]
    },
    {
      path: '/dashboard',
      redirect: '/dashboard/index',
      component:Layout,
      children: [
        {
          path: 'index',
          component: () => import('@renderer/views/dashboard/index.vue'),
          name: 'Dashboard',
          meta:{requiresAuth:false,type:'home'}
        },
        {
          path:'create',
          component:() => import('@renderer/views/dashboard/create.vue'),
          name:'passwordcreate',
          meta:{requiresAuth:false}
        },
        {
          path:'result',
          component:() => import('@renderer/views/dashboard/result.vue'),
          name:'DashboardResult',
          meta:{requiresAuth:false}
        }
      ]
    },
    //
    {
      path: '/login',
      name: 'login',
      component: Layout,
      meta: {
        requiresAuth: false,
      },
      children:[{
        path:'index',
        component:() => import('@renderer/views/login/index.vue'),
        name:'login-index',
        meta:{requiresAuth:false}
      }]
    },
    {
        path: '/recycle',
        name: 'recycle',
        redirect:'/recycle/index',
        component: Layout,
        meta: {
          requiresAuth: false,
        },
        children:[{
          path:'index',
          component:() => import('@renderer/views/recycle/index.vue'),
          name:'recycle-index',
          meta:{requiresAuth:false,type:"recycle"}
        }]
      },
      
      {
        path: '/reward',
        name: 'reward',
        redirect:'/reward/index',
        component: Layout,
        meta: {
          requiresAuth: false,
        },
        children:[{
          path:'index',
          component:() => import('@renderer/views/reward/index.vue'),
          name:'reward-index',
          meta:{requiresAuth:false,type:"reward"}
        }]
      },
      {
        path: '/setting',
        name: 'recycsettingle',
        redirect:'/setting/index',
        component: Layout,
        meta: {
          requiresAuth: false,
        },
        children:[{
          path:'index',
          component:() => import('@renderer/views/setting/index.vue'),
          name:'setting-index',
          meta:{requiresAuth:false,type:"setting"}
        },
        {
          path:'update',
          component:() => import('@renderer/views/setting/update.vue'),
          name:'update-masterpassword',
          meta:{requiresAuth:false,type:"setting"}
        }]
      },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});
export default router;