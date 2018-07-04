<template>
  <div class="contents">
    <div class="container">
      <div class="content">
        <div class="sidebar">
          <div class="itemList">
            <ul id="items">
              <li class="active">
                Black List
              </li>
              <li>
                <router-link class="button" :to="{ name: 'api' }">
                  API Key
                </router-link>
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
          <div class="blacklist">
            <h2>Black List</h2>
            <div class="command">
              <input class="input" v-model="inputSymbol" type="text" placeholder="코인명 입력"/>
              <button @click="addBlackList()">추가</button>
              <button @click="removeBlackList()">삭제</button>
            </div>
            <div class="coinSymbol">
              {{ blacklist }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'blacklist',
  data () {
    return {
      blacklist: [],
      inputSymbol: ''
    }
  },
  created () {
    this.getBlackList()
  },
  methods: {
    getBlackList () {
      this.$http.get(this.$API_SERVER + 'dashboard/manage/global/', {
        headers: {Authorization: 'Token ' + localStorage.getItem('login_token')}
      })
        .then(response => {
          let data = response['data']
          for (let i = 0; i < data.length; i++) {
            if (data[i]['name'] === 'coinBlackList') {
              // this.blacklist = data[i]['value'].split(',')
              this.blacklist = data[i]['value'].split(',')
            }
          }
        })
        .catch(e => {
          console.log(e)
        })
    },
    addBlackList () {
      if (this.inputSymbol === '') {
        alert('추가할 코인을 입력해주세요')
        return false
      }
      let stop = false
      let blacklistStr = ''
      let answer = confirm('블랙리스트에 추가하시겠습니까?')
      if (answer) {
        for (let i = 0; i < this.blacklist.length; i++) {
          if (this.blacklist[i] === this.inputSymbol.toUpperCase()) {
            stop = true
          }
          blacklistStr += this.blacklist[i] + ','
        }
        if (stop === true) {
          alert('이미 블랙리스트에 등록된 코인입니다.')
          return false
        } else {
          blacklistStr += this.inputSymbol.toUpperCase()
        }
        this.saveBlackList(blacklistStr)
      }
    },

    removeBlackList () {
      if (this.inputSymbol === '') {
        alert('삭제할 코인을 입력해주세요')
        return false
      }
      let stop = true
      let blacklistStr = ''
      let answer = confirm('블랙리스트에서 삭제하시겠습니까?')
      if (answer) {
        for (let i = 0; i < this.blacklist.length; i++) {
          if (this.blacklist[i] === this.inputSymbol.toUpperCase()) {
            stop = false
            continue
          } else {
            blacklistStr += this.blacklist[i] + ','
          }
        }
        if (stop === true) {
          alert('블랙리스트에 등록되지 않은 코인입니다.')
          return false
        } else {
          blacklistStr = blacklistStr.slice(0, -1)
          this.saveBlackList(blacklistStr)
        }
      }
    },

    saveBlackList (blacklist) {
      this.$http.post(this.$API_SERVER + 'dashboard/manage/global/bulk/', {'dashboard_coinBlackList': blacklist}, {
        headers: { Authorization: 'Token ' + localStorage.getItem('login_token') }
      })
        .then(response => {
          alert('완료')
          this.getBlackList()
        })
        .catch(e => {
          console.log(e)
        })
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

.blacklist {
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

.blacklist {
  background-color: #F2F2F2;
  margin-top: 20px;
}

.command {
  margin: 20px 0 0 0;
}

.input {
  outline: 0;
  border: 1px solid black;
  font-size: 15px;
  padding: 3px;
  width: 70px;
}

.command > button {
  border: 1px solid black;
  outline: 0;
  font-size: 15px;
  padding: 2px;
  margin-left: 10px;
  cursor: pointer;
}

.command > button:hover {
  color: red;
}

.coinSymbol {
  border: 1px solid black;
  font-size: 20px;
  padding: 30px;
  margin-top: 20px;
}
</style>
