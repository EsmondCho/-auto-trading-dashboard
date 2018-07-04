<template>
  <div class="contents">
    <div class="container">
      <div class="content">
        <div class="sidebar">
          <div class="itemList">
            <ul id="items">
              <li>
                <router-link class="button" :to="{ name: 'blacklist' }">
                  Black List
                </router-link>
              </li>
              <li class="active">
                API Key
              </li>
              <li>
                <router-link class="button" :to="{ name: 'exchange' }">
                  Bithumb WallAdd
                </router-link>
              </li>
              <li>
                <router-link class="button" :to="{ name: 'exchange' }">
                  Bittrex WallAdd
                </router-link>
              </li>
            </ul>
          </div>
        </div>
        <div class="manage">
          <div class="exchange">
            <h2>API key</h2>
            <table class="tb-add">
              <tr>
                <th class="col1">거래소</th>
                <th class="col2">key</th>
                <th class="col3">secret</th>
                <th class="col4">삭제</th>
              </tr>
              <tr>
                <td class="col1">bithumb</td>
                <td class="col2">{{ bithumbApi.apiKey }}</td>
                <td class="col3">{{ bithumbApi.apiSecret }}</td>
                <td class="col4">삭제</td>
              </tr>
              <tr>
                <td class="col1">bittrex</td>
                <td class="col2">{{ bittrexApi.apiKey }}</td>
                <td class="col3">{{ bittrexApi.apiSecret }}</td>
                <td class="col4">삭제</td>
              </tr>
              <tr>
                <td class="col1">
                  <input class="input" type="text" />
                </td>
                <td class="col2">
                  <input class="input" type="text" >
                </td>
                <td class="col3">
                  <input class="input" type="text" />
                </td>
                <td class="col4">
                </td>
              </tr>
            </table>
            <button id="btn-newAdd">+</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'api',
  data () {
    return {
      bithumbApi: {
        'apiKey': '',
        'apiSecret': ''
      },
      bittrexApi: {
        'apiKey': '',
        'apiSecret': ''
      }
    }
  },
  created () {
    this.getKeyList()
  },
  methods: {
    getKeyList () {
      this.$http.get(this.$API_SERVER + 'dashboard/manage/global/', {
        headers: {Authorization: 'Token ' + localStorage.getItem('login_token')}
      })
        .then(response => {
          let data = response['data']
          for (let i = 0; i < data.length; i++) {
            if (data[i]['name'] === 'bithumbApiKey') {
              this.bithumbApi.apiKey = data[i]['value']
            } else if (data[i]['name'] === 'bithumbApiSecret') {
              this.bithumbApi.apiSecret = data[i]['value']
            } else if (data[i]['name'] === 'bittrexApiKey') {
              this.bittrexApi.apiKey = data[i]['value']
            } else if (data[i]['name'] === 'bittrexApiSecret') {
              this.bittrexApi.apiSecret = data[i]['value']
            }
          }
        })
        .catch(e => {
          console.log(e)
        })
    },
    getAddressList (exchange) {
      this.$http.get(this.$API_SERVER + 'dashboard/management/exchange/' + exchange + '/walletaddress')
        .then(response => {
          this.exchange = exchange
          this.addressList = response['data']
        })
        .catch(e => {
          console.log(e)
        })
    },
    setExchange (exchange) {
      this.getAddressList(exchange)
    },

    isActive (exchange) {
      if (this.exchange === exchange) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style scoped>
.contents {
  width: 100%;
  height: 1000px;
}

.container {
  width: 100%;
  max-width: 1024px;
  margin: auto;
  height: 100%;
  padding: 30px 0;
}

.content {
  width: 100%;
  height: 100%;
  background-color: #353535;
}

.sidebar {
  padding: 10px 20px;
  width: 17%;
  height: 95%;
  float: left;
}

.manage {
  float: left;
  width: 71%;
  height: 100%;
  margin: 0 2%;
  padding: 15px 18px;
}

.itemList {
  background-color: #F2F2F2;
  color: #353535;
  height: 90%;
  margin: 20px 0;
  padding-top: 30px;
}

#items {
  list-style-type: none;
}

#items > li {
  margin: 30px 0;
  cursor: pointer;
}

#items > li > a {
  text-decoration: none;
  color: #353535;
}

#items > li > a:hover {
  color: red;
}

#items > li.active {
  color: red;
}

#items > li:hover {
  color: red;
}

.exchange {
  background-color: #F2F2F2;
  margin-top: 20px;
  padding-top: 30px;
}

.exchange > h2 {
  margin-bottom: 20px;
}

.tb-add {
  width: 90%;
  border-spacing: 0;
  text-align: left;
  margin: auto;
  /*margin: 20px 10px;*/
}
.tb-add > tr > th {
    /*width: 155px;*/
    padding: 10px;
    font-weight: bold;
    vertical-align: top;
    color: white;
    background: #8C8C8C;
}
.tb-add > tr > td {
    padding: 10px;
    vertical-align: top;
    border-bottom: 1px solid black;
    background: white;
    height: 20px;
}

.col2.linebreak {
    width: 50%;
}

.col1 {
}

.col2 {
  max-width: 200px;
}

.col3 {
  max-width: 200px;
}

.col4 {
  color: red;
  cursor: pointer;
}

.input {
  outline: 0;
  border: 1px solid black;
  font-size: 20px;
  padding: 3px;
  width: 100%;
}

#coin {
  width: 50px;
}

#btn-newAdd {
  font-size: 30px;
  margin: 20px;
  padding: 0;
  width: 50px;
  border: 1px solid black;
  cursor: pointer;
  outline: 0;
}

</style>
