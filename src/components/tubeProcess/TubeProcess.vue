<template>
  <div class="contents">
    <div class="container">
      <div class="content">
        <div class="sidebar">
          <button id="btn-tb" @click="showInit">New Tube</button>
          <div class="tubeList">
            <h3>tube list</h3>
            <ul id="items">
              <li v-for="tube in tubeList" :key="tube.id" @click="selectTube(tube.tubeId)">
                {{ tube.tubeId }}
              </li>
            </ul>
          </div>
        </div>
        <div class="tube">
          <div v-if="status">
            <h2 id="tubeId">
              tube id : {{ tubeNow.tubeId }}
              <button class='btn-cancel' @click="cancelTube(tubeNow.tubeId)">Cancel</button>
            </h2>
            <div class="tubeStatus stepValue" v-if="status">
              <div class="stepNum">
                <h1>step : {{ tubeNow.stepNow }}</h1>
                <p>base : {{ tubeNow.initPrice }}</p>
                <p>currency : {{ tubeNow.valueNow }}</p>
              </div>
              <div class="stepInfo">
                <h2>description</h2>
                {{ tubeNow.desc }}
                <p>price : {{ selectionInfo.price }} / bid : {{ selectionInfo.bid }}</p>
                <p>ask : {{ selectionInfo.ask }} / bit : {{ selectionInfo.bit }}</p>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="tubeStatus initValue">
              <input id="inputInitValue" placeholder="init price" type="number" v-model="initValue" />
              <button id="btn-smt" @click="init">INIT</button>
            </div>
          </div>
          <div class="selectAlt" v-if=checkSelect(tubeNow) :class="{ checked : isChecked() }">
            <div>
              <table class="tb-alt">
                <tr>
                  <th></th>
                  <th>SRC</th>
                  <th>DES</th>
                  <th>COIN</th>
                  <th>PRICE</th>
                  <th>BID</th>
                  <th>ASK</th>
                  <th>VALUE_DIFF</th>
                  <th>PERCENT</th>
                  <th>PREMIUM</th>
                </tr>

                <tr v-for="p in premiumInfo" :key="p.id">
                  <td><input type="radio" name="choice" value="p.currency"></td>
                  <td>{{ p.from }}</td>
                  <td>{{ p.to }}</td>
                  <td>{{ p.currency }}</td>
                  <td>{{ p.thumbPrice }}</td>
                  <td>{{ p.thumbValue }}</td>
                  <td>{{ p.trexValue }}</td>
                  <td>{{ p.valueGap }}</td>
                  <td>{{ p.valueGapPer }}</td>
                  <td>{{ p.gimpPer }}</td>
                </tr>
              </table>
              <button id="btn-slt" @click="selectAlt()">submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tubeProcess',
  components: {
  },
  data () {
    return {
      tubeList: '',
      status: false,
      intervalId: '',
      initValue: 0,
      tubeNow: {
        stepNow: 0,
        tubeId: '',
        initPrice: 0,
        valueNow: 0,
        steps: '',
        description: '',
        intervalId: ''
      },
      checked: false,
      premiumInfo: '',
      selectionInfo: {
        'price': 0,
        'bid': 0,
        'ask': 0,
        'bit': 0
      }
    }
  },
  created () {
    this.getTubeList()
    this.intervalId = setInterval(this.getTubeList, 3000)
  },
  mounted () {
  },
  destroyed () {
    clearInterval(this.intervalId)
  },
  methods: {
    getTubeList () {
      console.log(this.$API_SERVER + 'dashboard/tube')
      this.$http.get(this.$API_SERVER + 'dashboard/tube', {
        headers: { Authorization: 'Token ' + localStorage.getItem('login_token') }
      })
        .then(response => {
          this.tubeList = response['data']['tubes']
          if (this.tubeList.length === 0) {
            this.clearTubeNow()
            this.status = false
          }
        })
        .catch(e => {
          console.log(e)
        })
    },
    showInit () {
      clearInterval(this.intervalId)
      this.intervalId = setInterval(this.getTubeList, 3000)
      this.status = false
      this.clearTubeNow()
    },
    init () {
      // let formData = new FormData()
      // alert(this.initValue)
      var answer = confirm('튜브를 생성하시겠습니까?')
      if (answer) {
        this.$http.post(this.$API_SERVER + 'dashboard/tube', {'initPrice': this.initValue}, {
          headers: { Authorization: 'Token ' + localStorage.getItem('login_token') }
        })
          .then(response => {
            // this.status = true
            alert('튜브가 생성되었습니다.')
          })
          .catch(e => {
            console.log(e)
          })
      }
    },
    selectAlt (ex) {
      let choices = document.getElementsByName('choice')
      for (let i = 0; i < choices.length; i++) {
        if (choices[i].checked) {
          let rbody = {
            'coin': this.premiumInfo[i]['currency'],
            'thumb_alt_price': this.premiumInfo[i]['thumbPrice'],
            'trex_alt_value': this.premiumInfo[i]['trexValue']
          }
          this.$http.put(this.$API_SERVER + 'dashboard/tube/' + this.tubeNow['tubeId'], rbody, {
            headers: { Authorization: 'Token ' + localStorage.getItem('login_token') }
          })
            .then(response => {
              this.checked = true
              this.premiumInfo = ''
            })
            .catch(e => {
              console.log(e)
            })
          return true
        }
      }
    },
    isChecked () {
      return this.checked
    },
    selectTube (tubeId) {
      this.tubeNow['tubeId'] = tubeId
      clearInterval(this.intervalId)
      this.getTube(tubeId)
      this.getPremium()
      this.intervalId = setInterval(this.batch, 3000)
    },
    batch () {
      this.getTubeList()
      this.getTube()
    },
    getTube () {
      this.$http.get(this.$API_SERVER + 'dashboard/tube/' + this.tubeNow['tubeId'], {
        headers: { Authorization: 'Token ' + localStorage.getItem('login_token') }
      })
        .then(response => {
          this.status = true
          this.tubeNow['stepNow'] = response['data']['stepNow']
          this.tubeNow['tubeId'] = response['data']['tubeId']
          this.tubeNow['steps'] = response['data']['steps']
          this.tubeNow['initPrice'] = response['data']['steps'][0]['init_price']
          this.tubeNow['valueNow'] = response['data']['steps'][response['data']['steps'].length - 1]['price']
          this.tubeNow['desc'] = response['data']['steps'][response['data']['steps'].length - 1]['desc']
          // 알트 선택 시 정보들
          // console.log(response['data']['steps'])
          if (response['data']['steps'].length > 1) {
            this.selectionInfo['price'] = response['data']['steps'][1]['thumb_alt_price']
          }
          if (response['data']['steps'].length > 2) {
            this.selectionInfo['bid'] = response['data']['steps'][2]['thumb_alt_value']
            this.selectionInfo['bit'] = response['data']['steps'][2]['thumb_btc_price']
            this.selectionInfo['ask'] = response['data']['steps'][2]['trex_alt_value']
          }
          if (response['data']['steps'].length > 7) {
            this.selectionInfo.ask = response['data']['steps'][7]['trex_alt_value']
          }
          // this.selectionInfo.price = localStorage.getItem('price')
          // this.selectionInfo.bid = localStorage.getItem('bid')
          // this.selectionInfo.ask = localStorage.getItem('ask')
          // this.selectionInfo.bit = localStorage.getItem('bit')

          // 프로세스 종료시 로컬스토리지 삭제 -- 중복 삭제 문제 해결하기
          // if (this.tubeNow['stepNow'] > 16) {
          //   localStorage.removeItem('price')
          //   localStorage.removeItem('bid')
          //   localStorage.removeItem('ask')
          //   localStorage.removeItem('bit')
          // }
        })
        .catch(e => {
          console.log(e)
        })
    },
    getPremium () {
      this.$http.get(this.$API_SERVER + 'dashboard/premium', {
        headers: { Authorization: 'Token ' + localStorage.getItem('login_token') }
      })
        .then(response => {
          if (this.tubeNow['stepNow'] === 1) {
            this.premiumInfo = response['data']['src']
            for (let i = 0; i < 3; i++) {
              this.premiumInfo[i].from = 'bithumb'
              this.premiumInfo[i].to = 'bittrex'
            }
            this.premiumInfo.bitPrice = response['data']['premiums'][0]['thumbPrice']
          } else if (this.tubeNow['stepNow'] === 9) {
            this.premiumInfo = response['data']['dest']
            for (let i = 0; i < 3; i++) {
              this.premiumInfo[i].from = 'bittrex'
              this.premiumInfo[i].to = 'bithumb'
            }
            this.premiumInfo.bitPrice = response['data']['premiums'][0]['thumbPrice']
          }
        })
        .catch(e => {
          console.log(e)
        })
    },
    checkSelect (tubeNow) {
      if (this.status === false) {
        return false
      } else if (this.tubeNow['stepNow'] === 1 || this.tubeNow['stepNow'] === 9) {
        if (this.premiumInfo === '') {
          this.getPremium()
        }
        return true
      }
    },
    clearTubeNow () {
      this.tubeNow['tubeId'] = ''
      this.tubeNow['initPrice'] = 0
      this.tubeNow['valueNow'] = 0
      this.tubeNow['step'] = 0
      this.tubeNow['description'] = ''
      this.tubeNow['intervalId'] = 0
    },

    cancelTube (tubeId) {
      var answer = confirm('정말로 튜브를 종료하시겠습니까?')
      if (answer) {
        this.$http.delete(this.$API_SERVER + 'dashboard/tube/' + String(tubeId), {
          headers: { Authorization: 'Token ' + localStorage.getItem('login_token') }
        })
          .then(response => {
            alert('튜브가 종료되었습니다.')
          })
          .catch(e => {
            console.log(e)
          })
      }
    }
    // storeSelectionInfo (pInfo, bit) {
    //   localStorage.setItem('price', pInfo['thumbPrice'])
    //   localStorage.setItem('bid', pInfo['thumbValue'])
    //   localStorage.setItem('ask', pInfo['trexValue'])
    //   localStorage.setItem('bit', bit)
    // }
  }
}
</script>

<style scoped>
  .contents {
    width: 100%;
    height: 650px;
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

  #btn-tb {
    margin: 5px 0;
    width: 100%;
    font-size: 20px;
    height: 30px;
    outline: 0;
    cursor: pointer;
    border: 1px solid black;
  }

  #btn-tb:hover {
    background-color: #BDBDBD;
  }

  .tubeList {
    background-color: #F2F2F2;
    color: #353535;
    height: 90%;
    margin: 5px 0;
  }

  .tubeList #items {
    text-align: left;
    padding-left: 25px;
  }

  .tubeList #items > li {
    margin: 20px 0 0 0;
    cursor: pointer;
  }

  .tubeList #items > li:hover {
    color: red;
  }

  .tube {
    float: left;
    width: 71%;
    height: 100%;
    margin: 0 2%;
    padding: 15px 18px;
  }

  .tube #tubeId {
    color : #F2F2F2;
  }

  .tubeStatus {
    background-color: #F2F2F2;
    height: 100px;
    margin: 10px;
  }

  .initValue {
    font-size: 25px;
  }

  .initValue #btn-smt {
    height: 30px;
    font-size: 20px;
    border: 1px solid black;
    padding: 0px 10px;
    cursor: pointer;
    outline: 0;
  }

  .initValue #btn-smt:hover {
    background-color: #BDBDBD;
  }

  #inputInitValue {
    width: 300px;
    height: 30px;
    font-size: 25px;
    border: 1px solid black;
    margin-top: 30px;
    padding: 5px 10px;
    outline: 0;
  }

  .stepNum {
    float: left;
    width: 35%;
    height: 100%;
  }

  .stepInfo {
    float: left;
    width: 65%;
    height: 100%;
  }

  .selectAlt {
    background-color: #F2F2F2;
    /*height: 170px;*/
    margin: 30px 10px;
  }

  .tb-alt {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
    font-size: 13px;
  }

  td, th {
      border: 1px solid #dddddd;
      padding: 10px 0;
  }

  tr:nth-child(even) {
      background-color: #dddddd;
  }

  #btn-slt {
    margin: 5px 0;
    width: 80px;
    font-size: 20px;
    height: 30px;
    outline: 0;
    cursor: pointer;
    border: 1px solid black;
  }

  #btn-slt:hover {
    background-color: #BDBDBD;
  }

  .checked {
    pointer-events: none;
    background-color: #BDBDBD;
  }

  .btn-cancel {
    border: 1px solid black;
    border-radius: 7px;
    font-size: 20px;
    padding: 3px 15px;
    color: white;
    background-color: red;
    cursor: pointer;
    outline: 0;
    margin-left: 10px;
  }

</style>
