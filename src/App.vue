<template>
  <div id="app">
    <navbar></navbar>
    <router-view/>
  </div>
</template>

<script>
import navbar from './components/base/Navbar.vue'
import auth from './auth'

export default {
  name: 'App',
  components: {
    navbar
  },

  data () {
    return {
      user: auth.user
    }
  },

  created () {
    auth.checkAuth()
  },

  updated () {
    // console.log('app - updated')
    auth.checkAuth()
    if (!this.user.authenticated) {
      this.$router.push('/')
    }
  },

  mounted () {
    // console.log('app - mounted')
    auth.checkAuth()
    if (!this.user.authenticated) {
      this.$router.push('/')
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
