<template>
  <div class="contents">
    <div class="container">
      <div class="content">
        <div class="box">
          <div class="login">
            <p>페이지 접속을 위해 로그인이 필요합니다.</p>
            <input maxlength="30" autocomplete="off" class="input" id="id" type="text" name="id" placeholder="ID" v-model="credentials.username"/><br />
            <input maxlength="30" autocomplete="off" class="input" id="pwd" type="password" name="pwd" placeholder="Password" v-model="credentials.password"/>
            <input @click="submit()" id="submit" type="submit" value="로그인"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import auth from '../../auth'

export default {
  name: 'login',
  data () {
    return {
      credentials: {
        username: '',
        password: ''
      },
      error: ''
    }
  },
  created () {
    if (auth.user.authenticated) {
      this.$router.push('/tubeProcess')
    }
  },
  methods: {
    submit () {
      let credentials = {
        username: this.credentials.username,
        password: this.credentials.password
      }
      // We need to pass the component's this context
      // to properly make use of http in the auth service
      auth.login(this, credentials, '/tubeProcess')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .contents {
    width: 100%;
  }

  .container {
    width: 100%;
    max-width: 1024px;
    margin: auto;
  }

  .content {
    position: relative;
    width: 100%;
    margin-top: 140px;
  }

  .box {
    width: 373px;
    height: 204px;
    background-color: #353535;
    margin: 140px auto;
    display: inline-block;
  }

  .login {
    position: relative;
    margin-top: 50px;
  }

  .login > p {
    margin: 0 0 10px 0;
    font-size: 18px;
    color: #F2F2F2;
  }

  .input {
    position: absolute;
    width: 180px;
    padding: 3px 5px;
    box-sizing: border-box;
    border: 1px solid #DBDBDB;
    -webkit-transition: 0.5s;
    transition: 0.5s;
    outline: none;
    background-color: #DBDBDB;
    font-size: 16px;
    border-radius: 8px;
  }

  .input:focus {
    border: 1px solid #555;
  }

  #id {
    top: 45px;
    left: 60px;
  }

  #pwd {
    top: 80px;
    left: 60px;
  }

  input[type=submit] {
    position: absolute;
    top: 50px;
    right: 55px;

    width: 50px;
    height: 50px;
    font-size: 13px;

    background-color: #F2F2F2;
    color: #353535;
    font-weight: 600;

    padding:0;
    border: 0 none;
    cursor:pointer;
    -webkit-border-radius: 30px;
    border-radius: 30px;
  }

  input[type=submit]:focus {
    outline: 0;
  }

</style>
