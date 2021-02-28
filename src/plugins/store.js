import Vue from 'vue'
import Vuex from 'vuex'
import info from '../models/info'
import LZString from 'lz-string'

Vue.use(Vuex)

// root state object.
// each Vuex instance is just a single state tree.
const state = {
  loading: true,
  shift: false,
  player: null,
}

// mutations are operations that actually mutate the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by plugins
// for debugging purposes.
const mutations = {
  toggleLoading(state, data) {
    state.loading = data.value
  },
  toggleShift(state, data) {
    state.shift = data.value
  },
  mutatePlayer(state, data) {
    state.player = data.player
  },
  mutateKeyMode (state, data) {
    state.player.keyMode = data.mode
  },
  mutateGameMode (state, data) {
    state.player.gameMode = data.mode
  },
  addResource(state, data) {
    state.player.resources[data.id] += data.amount
  },
  addSkill(state, data) {
    state.player.skills[data.id] += data.amount
  },
  addSetup(state, data) {
    state.player.setup[data.id] += data.amount
  },
  addCheat(state, data) {
    state.player.cheats[data.id] += data.amount
  },
  toggleUpgrade(state, data) {
    state.player.upgrades[data.id] = data.value
  },
  toggleAchievement(state, data) {
    state.player.achievements[data.id] = data.value
  },
  reset(state, data) {
    state.player = {
      stats: {
        name: data.name,
        startTime: 0,
        time: 0,
        version: 0.1,
        rebirths: 0,
      },
      keyConfigs: [
        {
          keyBind: 's',
          background: 'white',
          color: 'black'
        },
        {
          keyBind: 'd',
          background: 'dodgerblue',
          color: 'black'
        },
        {
          keyBind: 'f',
          background: 'white',
          color: 'black'
        },
        {
          keyBind: ' ',
          background: 'gold',
          color: 'black'
        },
        {
          keyBind: 'j',
          background: 'white',
          color: 'black'
        },
        {
          keyBind: 'k',
          background: 'dodgerblue',
          color: 'black'
        },
        {
          keyBind: 'l',
          background: 'white',
          color: 'black'
        },
      ],
      keyMode: 1,
      gameMode: 'practice',
      resources: {
        experience: 0,
        money: 0,
        clout: 0,
        stamina: 0,
        combo: 0,
        genes: 0,
      },
      skills: {
        reading: 0,
        jacks: 0,
        trilling: 0,
        technique: 0,
        accuracy: 0,
        focus: 0,
      },
      setup: {
        pc: 0,
        keyboard: 0,
        monitor: 0,
        chair: 0,
        headset: 0,
      },
      upgrades: {
        0: false,
        1: false,
        2: false,
        3: false,
      },
      cheats: {
        bot: 0,
        macro: 0,
        pause: 0,
      },
      buffs: {
        redbull: {
          level: 0,
          active: false,
          lastActive: 0,
        },
        vibro: {
          level: 0,
          active: false,
          lastActive: 0,
        },
      },
      achievements: {
        foolmoon: false,
        firststream: false,
        firsttournament: false
      },
      mutations: {
        xp: 0,
      },
    }
  },
  rebirth(state, data) {
    state.player = {
      stats: {
        startTime: state.player.stats.startTime,
        time: state.player.stats.time,
        version: state.player.stats.version,
        rebirths: state.player.stats.rebirths + 1,
      },
      keyConfigs: state.keyConfigs,
      keyMode: 1,
      gameMode: 'practice',
      resources: {
        experience: 0,
        money: 0,
        clout: 0,
        stamina: 0,
        combo: 0,
        genes: state.resources.genes + data.amount,
      },
      skills: {
        reading: 0,
        jacks: 0,
        trilling: 0,
        technique: 0,
        accuracy: 0,
        focus: 0,
      },
      setup: {
        pc: 0,
        keyboard: 0,
        monitor: 0,
        chair: 0,
        headset: 0,
      },
      upgrades: {
        0: false,
        1: false,
        2: false,
        3: false,
      },
      cheats: {
        bot: 0,
        macro: 0,
        pause: 0,
      },
      buffs: {
        redbull: {
          level: 0,
          active: false,
          lastActive: 0,
        },
        vibro: {
          level: 0,
          active: false,
          lastActive: 0,
        },
      },
      achievements: state.player.achievements,
      genes: state.player.genes,
    }
  }
}

// actions are functions that cause side effects and can involve
// asynchronous operations.
const actions = {
  toggleLoading({ commit }, data) {
    commit('toggleLoading', data)
  },
  toggleShift({ commit }, data) {
    commit('toggleShift', data)
  },
  changeKeyMode({ commit, state }, data) {
    if(state.player.keyMode == 7) return
    commit('changeKeyMode', data)
  },
  changeGameMode({ commit }, data) {
    commit('changeGameMode', data)
  },
  giveResource({ commit }, data) {
    commit('addResource', data)
  },
  buySkill({ state, commit }, data) {
    var cost = info.skills[data.id].costFunction(state.player.skills[data.id]) * data.amount
    if(state.player.resources.experience < cost) return
    commit('addResource', {
      id: 'experience',
      amount: -cost
    })
    commit('addSkill', data)
  },
  buySetup({ state, commit }, data) {
    var cost = info.setup[data.id][state.player.setup[data.id]].cost * data.amount
    if(state.player.resources.money < cost) return
    commit('addResource', {
      id: 'money',
      amount: -cost
    })
    commit('addSetup', data)
  },
  buyCheat({ state, commit }, data) {
    var cost = info.cheats[data.id].cost(state.player.cheats[data.id]) * data.amount
    if(state.player.resources.clout < cost) return
    commit('addResource', {
      id: 'clout',
      amount: -cost
    })
    commit('addCheat', data)
  },
  unlockUpgrade({ state, commit }, data) {
    var cost = info.upgrades[data.id].cost
    if(state.player.upgrades[data.id] == true || state.player.resources.experience < info.upgrades[data.id].cost) return
    commit('addResource', {
      id: 'experience',
      amount: -cost
    })
    commit('toggleUpgrade', { id: data.id, value: true })
  },
  unlockAchievement({ state, commit }, data) {
    if(state.player.achievements[data.id] == true) return
    commit('toggleAchievement', { id: data.id, value: true })
  },
  importGame({ commit }, data) {
    commit('mutatePlayer', data)
  },
  saveGame({ state }) {
    localStorage.setItem('osumaniaidle', LZString.compressToBase64(JSON.stringify(state.player)))
  },
  loadGame({ commit }) {
    var player;
    try {
      player = JSON.parse(LZString.decompressFromBase64(localStorage.getItem('osumaniaidle')))
    } catch(Exception) {
      return
    }
    commit('mutatePlayer', {
      player: player
    })
  },
  resetGame({ commit }, data) {
    commit('reset', data)
  },
  rebirth({ commit }) {
    commit('rebirth')
  },
}

// getters are functions.
const getters = {
  loading: state => state.loading,
  importExportText: state => state.importExportText,
  gameMode: state => state.player.gameMode,
  keyMode: state => state.player.keyMode,
  experience: state => state.player.resources.experience,
  money: state => state.player.resources.money,
  clout: state => state.player.resources.clout,
  combo: state => state.player.resources.combo,
  stamina: state => state.player.resources.stamina,
  genes: state => state.player.resources.genes,
  skills: state => state.player.skills,
  setup: state => state.player.setup,
  cheats: state => state.player.cheats,
  upgrades: state => state.player.upgrades,
  achievements: state => state.player.achievements,
  mutations: state => state.player.mutations,
  currentKeys: state => {
    switch(state.player.keyMode) {
      case 1:
        return [state.player.keyConfigs[3]];
        case 2:
        return [state.player.keyConfigs[2], state.player.keyConfigs[4]];
        case 3:
        return [state.player.keyConfigs[2], state.player.keyConfigs[3], state.player.keyConfigs[4]];
        case 4:
        return [state.player.keyConfigs[1], state.player.keyConfigs[2], state.player.keyConfigs[4], state.player.keyConfigs[5]];
        case 5:
        return [state.player.keyConfigs[1], state.player.keyConfigs[2], state.player.keyConfigs[3], state.player.keyConfigs[4], state.player.keyConfigs[5]];
        case 6:
        return [state.player.keyConfigs[0], state.player.keyConfigs[1], state.player.keyConfigs[2], state.player.keyConfigs[4], state.player.keyConfigs[5], state.player.keyConfigs[6]];
        case 7:
        return [state.player.keyConfigs[0], state.player.keyConfigs[1], state.player.keyConfigs[2], state.player.keyConfigs[3], state.player.keyConfigs[4], state.player.keyConfigs[5], state.player.keyConfigs[6]];
    }
    return state.player.keyConfigs;
  },
  keysPerSecond: state => state.player.cheats.bot, //TODO
  keysPerTap: state => state.player.cheats.macro + 1, //TODO
  pp: state => {
    var sum = 0
    for(var skill of Object.values(state.player.skills)) {
      sum += skill
    }
    return sum / (4 * state.player.keyMode)
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
