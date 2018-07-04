// src/auth/index.js

// import {router} from '../index'

// URL and endpoint constants
const API_URL = process.env.API_BASE_URL
const LOGIN_URL = API_URL + 'login/sessions/create'

export default {

  // User object will let us check authentication status
  user: {
    authenticated: false
  },

  // Send a request to the login URL and save the returned JWT
  login (context, creds, redirect) {
    let formData = new FormData()

    // console.log(creds['username'])
    formData.append('username', creds['username'])
    formData.append('password', creds['password'])
    context.$http.post(LOGIN_URL, formData)
      .then(response => {
        if (response['status'] === 200) {
          localStorage.setItem('username', creds['username'])
          localStorage.setItem('login_token', response.data['token'])
          this.user.authenticated = true
          // Redirect to a specified route
          if (redirect) {
            // router.go(redirect)
            context.$router.push(redirect)
          }
        } else {
          alert('nono~~')
          return false
        }
      })
      .catch(e => {
        console.log(e)
      })
  },

  // To log out, we just need to remove the token
  logout () {
    localStorage.removeItem('username')
    localStorage.removeItem('login_token')
    this.user.authenticated = false
  },

  checkAuth () {
    let token = localStorage.getItem('login_token')
    if (token) {
      this.user.authenticated = true
    } else {
      this.user.authenticated = false
    }
  }
}
