<template>
  <div class="contents">
    <div class="container">
      <div class="content">
        <div class="history">
          <table class="summary">
            <tr>
              <th>index</th>
              <th>tube id</th>
              <th>tube time</th>
              <th>profit</th>
              <th>profit per</th>
              <th>end time</th>
              <th>states</th>
            </tr>
            <tr class="row" v-for="(tube, index) in historyTubeList" @click="getSteps(index)" :class="{active:isRowActive(index)}" :key="tube.id">
              <td v-if="tube.type=='summary'">{{ tube.index }}</td>
              <td v-if="tube.type=='summary'">{{ tube.tube_id }}</td>
              <td v-if="tube.type=='summary'">{{ tube.tube_time }}</td>
              <td v-if="tube.type=='summary'">{{ tube.profit }}</td>
              <td v-if="tube.type=='summary'">{{ tube.profit_per }}</td>
              <td v-if="tube.type=='summary'">{{ tube.end_time }}</td>
              <td v-if="tube.type=='summary'">{{ tube.status }}</td>
              <td colspan="7" v-else>
                <table class="steps">
                  <tr>
                    <th>stage</th>
                    <th>event</th>
                    <th>exchage</th>
                    <th>coin name</th>
                    <th>coin amt</th>
                    <th>coin value</th>
                    <th>price</th>
                    <th>time</th>
                  </tr>
                  <tr v-for="step in steps.data" :key="step.id">
                    <td>{{ step.stage }}</td>
                    <td>{{ step.event }}</td>
                    <td>{{ step.exchange }}</td>
                    <td>{{ step.coin_name }}</td>
                    <td>{{ step.coin_amt }}</td>
                    <td>{{ step.coin_value }}</td>
                    <td>{{ step.price }}</td>
                    <td>{{ step.time_stamp }}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <div class="page">
            <a id="prev" @click="getPrevNextPage(1)">prev</a>
            <li v-for="pageNumber in totalPages" :key="pageNumber.id">
              <a id="pageNum" :class="{ active: isActive(pageNumber) }" @click="setPage(pageNumber)">{{ pageNumber }}</a>
            </li>
            <a id="next" @click="getPrevNextPage(2)">next</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'history',
  data () {
    return {
      historyTubeList: [],
      currentPage: 0,
      itemsPerPage: 10,
      itemsAll: 0, // 전체 글 수
      steps: [],
      selectedHistory: -99,
      stepsIndex: -99
    }
  },
  created () {
    this.getHistory(1)
  },

  methods: {
    getHistory (page) {
      this.currentPage = page
      this.$http.get(this.$API_SERVER + 'tube/history/summary?page=' + String(page))
        .then(response => {
          this.itemsAll = response['data']['num_of_tube']
          this.historyTubeList = response['data']['history_tube_list']
          for (let i = 0; i < this.historyTubeList.length; i++) {
            this.historyTubeList[i].index = (this.currentPage - 1) * 10 + i + 1
            this.historyTubeList[i].type = 'summary'
          }
        })
        .catch(e => {
          console.log(e)
        })
    },

    setPage (pageNumber) {
      this.currentPage = pageNumber
      this.getHistory(pageNumber)
      this.selectedHistory = -99
      this.stepsIndex = -99
    },

    getPrevNextPage (pn) {
      if (pn === 1) {
        if (this.currentPage > 1) {
          this.setPage(this.currentPage - 1)
        } else {
          alert('첫번째 페이지입니다')
        }
      } else if (pn === 2) {
        if (this.currentPage !== this.totalPages) {
          this.setPage(this.currentPage + 1)
        } else {
          alert('마지막 페이지입니다')
        }
      }
    },

    isActive (page) {
      if (this.currentPage === page) {
        return true
      } else {
        return false
      }
    },

    isRowActive (index) {
      if (index === this.stepsIndex || index === this.stepsIndex - 1) {
        return true
      } else {
        return false
      }
    },

    getSteps (index, tubeIndex) {
      if (index === this.stepsIndex || index === this.stepsIndex - 1) {
        return false
      }
      let tubeId = this.historyTubeList[index]['tube_id']
      this.$http.get(this.$API_SERVER + 'tube/history/' + tubeId)
        .then(response => {
          if (this.selectedHistory !== -99) {
            this.historyTubeList.splice(this.stepsIndex, 1)
          }
          this.steps = {'data': response['data'], type: 'steps'}
          if (this.selectedHistory > index) {
            this.historyTubeList.splice(index + 1, 0, this.steps)
            this.stepsIndex = index + 1
          } else if (this.selectedHistory < index) {
            if (this.selectedHistory === -99) {
              this.historyTubeList.splice(index + 1, 0, this.steps)
              this.stepsIndex = index + 1
            } else {
              this.historyTubeList.splice(index, 0, this.steps)
              this.stepsIndex = index
            }
          } else {
            this.historyTubeList.splice(index + 1, 0, this.steps)
            this.stepsIndex = index + 1
          }
          this.selectedHistory = index
          console.log(this.selectedHistory)
        })
        .catch(e => {
          console.log(e)
        })
    }
  },

  computed: {
    totalPages () {
      return Math.ceil(this.itemsAll / this.itemsPerPage)
    }
  }
}
</script>

<style scoped>
  .contents {
    width: 100%;
  }

  .container {
    width: 100%;
    max-width: 1024px;
    margin: auto;
    padding: 30px 0;
  }

  .content {
    width: 100%;
    /*height: 300px;*/
    background-color: #353535;
    border: 1px solid blue;
  }

  .history {
    background-color: white;
    width: 95%;
    margin: 30px auto;
    padding: 50px 0;
  }

  .row:hover > td {
    background-color: #EAEAEA;
    /*background-color: #EAEAEA;*/
    cursor: pointer;
  }

  .row.active > td {
    background-color: #EAEAEA;;
  }

  .row.active:hover > td {
    background-color: #EAEAEA;;
  }

  .summary {
    width: 90%;
    border-spacing: 0;
    text-align: center;
    line-height: 1.5;
    margin: auto;
    /*margin: 20px 10px;*/
  }
  .summary > tr > th {
      width: 155px;
      padding: 10px;
      font-weight: bold;
      vertical-align: top;
      color: white;
      background: #8C8C8C;
  }
  .summary > tr > td {
      width: 155px;
      padding: 10px;
      vertical-align: top;
      border-bottom: 1px solid black;
      background: white;
  }

  .steps {
    width: 80%;
    margin: auto;
    border-spacing: 0;
    border: 2px solid black;
  }

  .steps > tr > th {
    padding: 10px;
    font-weight: bold;
    color: white;
    vertical-align: top;
    background: #CC3D3D;
  }

  .steps > tr > td {
      width: 155px;
      padding: 10px;
      vertical-align: top;
      border-bottom: 1px solid black;
      background: white;
  }

  /* pagination */
  .page {
    margin-top: 30px;
  }
  .page a {
    color: #999;
    cursor: pointer;
    font-size: 18px;
  }
  .page a:hover {
    color: red;
  }
  .page .current {
    color: red;
  }
  .page ul {
    padding: 0;
    list-style-type: none;
  }
  .page li {
    display: inline;
    margin: 5px 5px;
  }

  .page a.active {
    color: red;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

</style>
