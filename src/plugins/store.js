import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// root state object.
// each Vuex instance is just a single state tree.
const state = {
  stats: {
    totalCombo: 0,
  },
  combo: 0,
  keys: [
    {
      key: ' ',
      background: 'gold',
      color: 'black',
      padding: '8px',
    }
  ],
  skills: {
    reading: {
      id: 'reading',
      buyTag: 'Practice Reading',
      statTag: 'Reading',
      level: 0,
      cost: 5
    },
    jacks: {
      id: 'jacks',
      buyTag: 'Practice Jacks',
      statTag: 'Jacks',
      level: 0,
      cost: 5
    },
    trilling: {
      id: 'trilling',
      buyTag: 'Practice Trilling',
      statTag: 'Trilling',
      level: 0,
      cost: 5
    },
    technique: {
      id: 'technique',
      buyTag: 'Practice Technique',
      statTag: 'Technique',
      level: 0,
      cost: 5
    },
  },
  cheats: {
    bots: {
      id: 'bots',
      buyTag: 'Build a Bot',
      statTag: 'Bots',
      level: 0,
      cost: 10,
    },
    macros: {
      id: 'macros',
      buyTag: 'Program a Macro',
      statTag: 'Macros',
      level: 0,
      cost: 10,
    }
  }
}

// mutations are operations that actually mutate the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by plugins
// for debugging purposes.
const mutations = {
  mutateKeys (state, value) {
    state.keys = value
  },
  incrementTotalCombo (state, value) {
    state.stats.totalCombo += value
  },
  incrementCombo(state, value) {
    state.combo += value;
  },
  decrementCombo(state, value) {
    state.combo -= value;
  },
  incrementPractice(state, data) {
    state.skills[data.id].level += data.amount
    state.skills[data.id].cost += 1
  },
  incrementCheat(state, data) {
    state.cheats[data.id].level += data.amount
    state.cheats[data.id].cost += 1
  },
}

// actions are functions that cause side effects and can involve
// asynchronous operations.
const actions = {
  buyKey({ commit, state, getters }) {
    if(state.keys.length == 7 || getters.starRating < 10 ) return
    switch(state.keys.length) {
      case 1:
        commit('mutateKeys', [
          {
            key: 'f',
            background: 'white',
            color: 'black',
            padding: '8px 20px',
          },
          {
            key: 'j',
            background: 'white',
            color: 'black',
            padding: '8px 20px',
          }
        ])
        break;
      case 2:
        commit('mutateKeys', [
          {
            key: 'f',
            background: 'white',
            color: 'black',
            padding: '8px 20px',
          },
          {
            key: ' ',
            background: 'gold',
            color: 'black',
            padding: '8px',
          },
          {
            key: 'j',
            background: 'white',
            color: 'black',
            padding: '8px 20px',
          }
        ])
        break;
      case 3:
        commit('mutateKeys', [
          {
            key: 'd',
            background: 'dodgerblue',
            color: 'black',
            padding: '8px 20px',
          },
          {
            key: 'f',
            background: 'white',
            color: 'black',
            padding: '8px 20px',
          },
          {
            key: 'j',
            background: 'white',
            color: 'black',
            padding: '8px 20px',
          },
          {
            key: 'k',
            background: 'dodgerblue',
            color: 'black',
            padding: '8px 20px',
          }
        ])
        break;
      case 4:
        commit('mutateKeys', [
          {
            key: 'd',
            background: 'dodgerblue',
            color: 'black',
            padding: '8px 20px',
          },
          {
            key: 'f',
            background: 'white',
            color: 'black',
            padding: '8px 20px',
          },
          {
            key: ' ',
            background: 'gold',
            color: 'black',
            padding: '8px 8px',
          },
          {
            key: 'j',
            background: 'white',
            color: 'black',
            padding: '8px 20px',
          },
          {
            key: 'k',
            background: 'dodgerblue',
            color: 'black',
            padding: '8px 20px',
          }
        ])
        break;
      case 5:
        commit('mutateKeys', [
          {
            key: 's',
            background: 'white',
            color: 'black',
            padding: '8px 20px',
          },
          {
            key: 'd',
            background: 'dodgerblue',
            color: 'black',
            padding: '8px 15px',
          },
          {
            key: 'f',
            background: 'white',
            color: 'black',
            padding: '8px 20px',
          },
          {
            key: 'j',
            background: 'white',
            color: 'black',
            padding: '8px 20px',
          },
          {
            key: 'k',
            background: 'dodgerblue',
            color: 'black',
            padding: '8px 15px',
          },
          {
            key: 'l',
            background: 'white',
            color: 'black',
            padding: '8px 20px',
          },
        ])
        break;
      case 6:
        commit('mutateKeys', [
          {
            key: 's',
            background: 'white',
            color: 'black',
            padding: '8px 20px',
          },
          {
            key: 'd',
            background: 'dodgerblue',
            color: 'black',
            padding: '8px 15px',
          },
          {
            key: 'f',
            background: 'white',
            color: 'black',
            padding: '8px 20px',
          },
          {
            key: ' ',
            background: 'gold',
            color: 'black',
            padding: '8px',
          },
          {
            key: 'j',
            background: 'white',
            color: 'black',
            padding: '8px 20px',
          },
          {
            key: 'k',
            background: 'dodgerblue',
            color: 'black',
            padding: '8px 15px',
          },
          {
            key: 'l',
            background: 'white',
            color: 'black',
            padding: '8px 20px',
          },
        ])
        break;
    }
  },
  buyPractice({ state, commit }, data) {
    var skill = state.skills[data.id]
    if(state.combo < skill.cost) return
    commit('incrementPractice', {
      id: data.id,
      amount: data.amount
    })
    commit('decrementCombo', skill.cost)
  },
  buyCheat({ state, commit }, data) {
    var cheat = state.cheats[data.id]
    if(state.combo < cheat.cost) return
    commit('incrementCheat', {
      id: data.id,
      amount: data.amount
    })
    commit('decrementCombo', cheat.cost)
  },
  keyPressed({ commit, getters }) {
    commit('incrementCombo', getters.comboPerKey)
    commit('incrementTotalCombo', getters.comboPerKey)
  },
  timePassed({ commit, getters }, time) {
    commit('incrementCombo', (getters.keysPerSecond * getters.comboPerKey * time))
    commit('incrementTotalCombo', (getters.keysPerSecond * getters.comboPerKey * time))
  }
}

// getters are functions.
const getters = {
  keysPerSecond: state => state.cheats.bots.level,
  comboPerKey: state => state.cheats.macros.level + 1,
  starRating: state => {
    var sum = 0
    for(var skill of Object.values(state.skills)) {
      sum += skill.level
    }
    return sum / (4 * state.keys.length)
  }  
}

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
