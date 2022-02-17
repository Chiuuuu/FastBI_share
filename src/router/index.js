import VueRouter from "vue-router";
import Vue from "vue"
Vue.use(VueRouter)

const router = new VueRouter({
  mode: process.env.NODE_ENV === 'development' ? 'hash' : 'history',
  base: process.env.NODE_ENV === 'development' ? '/' : '/oashare/',
  routes: [
    // {
    //   path: '/',
    //   redirect: '/list'
    // },
    {
      path: '/401',
      meta: { title: '无效身份' },
      component: () => import('@/views/401')
    },
    {
      path: '/403',
      meta: { title: '过期页面' },
      component: () => import('@/views/403')
    },
    {
      path: '/list',
      meta: { title: 'OA发布列表' },
      component: () => import('@/views/OaList')
    },
    {
      path: '/screen/:id',
      meta: { title: 'OA发布大屏' },
      component: () => import('@/views/OaScreen')
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const whiteList = ['/403', '/401']
  if (to.meta.title) {
    document.title = to.meta.title
  }
  if (!whiteList.includes(to.path)) {
    // 判断是否有携带工号参数, 没有则判断token是否存在
    // if (to.query.oaNum) {
    //   // 根据工号获取token
    //   const res = await Vue.prototype.$api.oa.getToken({ oaNum: to.query.oaNum })
    //   if (res && res.code === 200) {
    //     window.localStorage.setItem('token', res.data)
    //     return next({ path: '/list' })
    //   } else {
    //     console.log(res.msg || 'token获取失败')
    //     return router.replace('/401')
    //   }
    // } else {
    if (to.query.token) {
      window.localStorage.setItem('token', to.query.token)
      return next({ path: '/list' })
    } else {
      const token = window.localStorage.getItem('token')
      if (!token) {
        router.replace('/401')
        return next()
      }
    }
  }
  next()
})

export default router