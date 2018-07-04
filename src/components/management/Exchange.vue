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
              <li>
                <router-link class="button" :to="{ name: 'api' }">
                  API Key
                </router-link>
              </li>
              <li v-bind:class="{ active: isActive('bithumb') }" @click="setExchange('bithumb')">
                Bithumb WallAdd
              </li>
              <li v-bind:class="{ active: isActive('bittrex') }" @click="setExchange('bittrex')">
                Bittrex WallAdd
              </li>
            </ul>
          </div>
        </div>
        <div class="manage">
          <div class="exchange">
            <h2>[ {{ exchange }} ]</h2>
            <table class="tb-add">
              <tr>
                <th class="col1">coin</th>
                <th class="col2">address</th>
                <th class="col3">tag</th>
                <th class="col4">삭제</th>
              </tr>
              <tr v-for="add in addressList" :key="add.id">
                <td class="col1" id="coin">{{ add.coin }}</td>
                <td class="col2">{{ add.address }}</td>
                <td class="col3">{{ add.tag }}</td>
                <td class="col4" @click="deleteAdd(exchange, add.coin)">삭제</td>
              </tr>
              <tr>
                <td class="col1">
                  <input class="input" type="text" v-model="inputCoin" />
                </td>
                <td class="col2">
                  <input class="input" type="text" v-model="inputAdd"/>
                </td>
                <td class="col3">
                  <input class="input" type="text" v-model="inputTag"/>
                </td>
                <td class="col4">
                </td>
              </tr>
            </table>
            <button @click="addNewAddress(exchange)" id="btn-newAdd">+</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'exchange',
  data () {
    return {
      exchange: 'bithumb',
      addressList: [],
      inputCoin: '',
      inputAdd: '',
      inputTag: ''
    }
  },
  created () {
    this.getAddressList('bithumb')
  },
  methods: {
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
    },

    addNewAddress (exchange) {
      var answer = confirm('새로운 지갑 주소를 생성하시겠습니까?')
      if (answer) {
        if (this.inputCoin === '') {
          alert('코인 심볼을 입력해주세요')
          return
        } else if (this.inputAdd === '') {
          alert('코인 지갑 주소를 입력해주세요')
          return
        }
        this.$http.post(this.$API_SERVER + 'dashboard/management/exchange/' + exchange + '/walletaddress', {'coin_symbol': this.inputCoin, 'address': this.inputAdd, 'tag': this.inputTag}, {
          headers: { Authorization: 'Token ' + localStorage.getItem('login_token') }
        })
          .then(response => {
            this.getAddressList(this.exchange)
          })
          .catch(e => {
            console.log(e)
          })
      }
    },

    deleteAdd (exchange, coin) {
      var answer = confirm('지갑 주소를 삭제하시겠습니까?')
      if (answer) {
        this.$http.delete(this.$API_SERVER + 'dashboard/management/exchange/' + exchange + '/walletaddress/' + coin, {
          headers: { Authorization: 'Token ' + localStorage.getItem('login_token') }
        })
          .then(response => {
            this.getAddressList(this.exchange)
          })
          .catch(e => {
            console.log(e)
          })
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
