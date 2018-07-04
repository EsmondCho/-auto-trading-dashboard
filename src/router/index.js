import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login/Login'
import tubeProcess from '@/components/tubeProcess/TubeProcess'
import blacklist from '@/components/management/Blacklist'
import api from '@/components/management/API'
import exchange from '@/components/management/Exchange'
import history from '@/components/history/History'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: login
    },
    {
      path: '/tubeProcess',
      name: 'tubeProcess',
      component: tubeProcess
    },
    {
      path: '/management/blacklist',
      name: 'blacklist',
      component: blacklist
    },
    {
      path: '/management/api',
      name: 'api',
      component: api
    },
    {
      path: '/management/exchange',
      name: 'exchange',
      component: exchange
    },
    {
      path: '/history',
      name: 'history',
      component: history
    }
  ]
})
