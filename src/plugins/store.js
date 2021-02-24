import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// root state object.
// each Vuex instance is just a single state tree.
const state = {
  totalKeysTapped: 0,
  combo: 0,
  keys: [' '],
  reading: 0,
  jacks: 0,
  trilling: 0,
  technique: 0,
  bots: 0,
}

// mutations are operations that actually mutate the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by plugins
// for debugging purposes.
const mutations = {
  mutateCombo (state, value) {
    state.combo = value
  },
  mutateTotalKeysTapped (state, value) {
    state.totalKeysTapped = value
  },
  mutateReading (state, value) {
    state.reading = value
  },
  mutateJacks (state, value) {
    state.jacks = value
  },
  mutateTrilling (state, value) {
    state.trilling = value
  },
  mutateTechnique (state, value) {
    state.technique = value
  },
  mutateBot (state, value) {
    state.bots = value
  },
  mutateKeys (state, value) {
    state.keys = value
  },
}

// actions are functions that cause side effects and can involve
// asynchronous operations.
const actions = {
  buyReading({ commit, state }) {
    if(state.combo >= 5 ) {
      commit('mutateReading', state.reading + 1)
      commit('mutateCombo', state.combo - 5)
    }
  },
  buyJacks({ commit, state }) {
    if(state.combo >= 5 ) {
      commit('mutateJacks', state.jacks + 1)
      commit('mutateCombo', state.combo - 5)
    }
  },
  buyTrilling({ commit, state }) {
    if(state.combo >= 5 ) {
      commit('mutateTrilling', state.trilling + 1)
      commit('mutateCombo', state.combo - 5)
    }
  },
  buyTechnique({ commit, state }) {
    if(state.combo >= 5 ) {
      commit('mutateTechnique', state.technique + 1)
      commit('mutateCombo', state.combo - 5)
    }
  },
  buyBot({ commit, state }) {
    if(state.combo >= 10 ) {
      commit('mutateBots', state.bots + 1)
      commit('mutateCombo', state.combo - 10)
    }
  },
  buyNewKey({ commit, state, getters }) {
    if(state.keys.length <= 7 && getters.starRating >= 10 ) {
      switch(state.keys.length) {
        case 1:
          commit('mutateKeys', ["f", "j"])
          break;
        case 2:
          commit('mutateKeys', ["f", " ", "j"])
          break;
        case 3:
          commit('mutateKeys', ["d", "f", "j", "k"])
          break;
        case 4:
          commit('mutateKeys', ["d","f", " ", "j", "k"])
          break;
        case 5:
          commit('mutateKeys', ["s", "d", "f", "j", "k", "l"])
          break;
        case 6:
          commit('mutateKeys', ["s", "d", "f", " ", "j", "k", "l"])
          break;
      }
    }
  },
  keyPressed({ commit, state }) {
    commit('mutateCombo', state.combo + 1)
    commit('mutateTotalKeysTapped', state.totalKeysTapped + 1)
  },
  timePassed({ commit, state, getters }, time) {
    commit('mutateCombo', state.combo + (getters.keysPerSecond * time))
  }
}

// getters are functions.
const getters = {
  keysPerSecond: state => state.bots * 1,
  starRating: state => (state.reading + state.jacks + state.trilling + state.technique) / (4 * state.keys.length)
}

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
