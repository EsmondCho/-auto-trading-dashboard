<template>
  <div class="navbar">
    <div class="container">
      <router-link id="logo" :to="{ name: 'tubeProcess' }">
        <h1 class="logo">
          Decryptous
        </h1>
      </router-link>
      <ul class="buttons">

        <li v-bind:class="{ active: isActive('tubeProcess') }">
          <router-link class="button" :to="{ name: 'tubeProcess' }">
            Tube Process
          </router-link>
        </li>
        <li v-bind:class="{ active: isActive('blacklist,api,exchange') }">
          <router-link class="button" :to="{ name: 'blacklist' }">
            Management
          </router-link>
        </li>
        <li v-bind:class="{ active: isActive('history') }">
          <router-link class="button" :to="{ name: 'history' }">
            History
          </router-link>
        </li>
        <li v-if="user.authenticated">
          <p id="id">{{ username }} 님</p>
          <button @click="logout" id="logout" type="button">로그아웃</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import auth from '../../auth'

export default {
  name: 'navbar',
  data () {
    return {
      activeItem: 'QA',
      username: '',
      user: auth.user
    }
  },
  methods: {
    isActive (nameList) {
      nameList = nameList.split(',')
      for (let i = 0; i < nameList.length; i++) {
        if (this.$route.path.includes(nameList[i])) {
          return this.$route.path.includes(nameList[i])
        }
      }
    },
    logout () {
      auth.logout()
      this.$router.push('/')
    }
  },
  mounted () {
    this.username = localStorage.getItem('username')
  },
  updated () {
    this.username = localStorage.getItem('username')
  }
}

</script>

<style scoped>
  .navbar {
    width: 100%;
    height: 60px;
    background-color: #353535;
    z-index: 100;
    border-bottom: 1px solid #D9D9D9;
  }

  .container {
    width: 100%;
    max-width: 1024px;
    margin: auto;
    padding: 0 16px;
    box-sizing: border-box;
  }

  .container:after {
    content: ' ';
    display: table;
    clear: both;
  }

  .logo {
    float: left;
    position: relative;
    display: block;
    margin: 0;
    padding: 0 0 0 30px;

    color: white;
    font-size: 23px;
    font-weight: 500;
    line-height: 60px;
    cursor: pointer;
  }

  #logo {
    text-decoration: none;
    cursor: default;
  }

  .logo:before {
    content: ' ';

    position: absolute;
    left: 0;
    top: calc(50% - 11px);

    display: block;
    width: 20px;
    height: 20px;
    /*background: url('../../assets/logo.svg');*/
    background-size: cover;
  }

  .buttons {
    position: relative;
    z-index: 99;
    float: right;
    margin: 0;
  }

  .buttons > li {
    position: relative;
    display: inline-block;
  }

  .buttons > li > a {
    padding: 0 20px;
  }

  #id {
    margin: 6px 10px 0 60px;;
    float: left;
    color: #F2F2F2;
    font-size: 15px;
  }

  #logout {
    background-color: #F2F2F2;
    color: #353535;
    border: 0;
    width: 60px;
    height: 30px;
    font-size: 13px;
    font-weight: 500;
    padding: 0;
    cursor: pointer;
  }

  #logout:focus {
    outline: 0;
  }

  .buttons > li + li {
    /*margin: 0 0 0 24px;*/
  }

  .buttons .active {
    background-color: #ffffff;
  }

  .active > a {
    color: #353535;
  }

  .buttons > li:hover > .button {
    /* 색 바꾸기 */
  }

  .button {
    display: block;

    color: white;
    font-size: 16px;
    font-weight: 600;
    text-decoration: none;
    line-height: 60px;
  }

</style>
