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
    state.player = data.value
  },
  mutateTime (state, data) {
    state.player.config.time = data.value
  },
  mutateScrollSpeed (state, data) {
    state.player.config.scrollSpeed = data.value
  },
  mutateBpm (state, data) {
    state.player.config.bpm = data.value
  },
  mutateFps (state, data) {
    state.player.config.fps = data.value
  },
  mutateOd (state, data) {
    state.player.config.od = data.value
  },
  mutateSkin (state, data) {
    state.player.config.skin = data.value
  },
  mutateComboPosition (state, data) {
    state.player.config.comboPosition = data.value
  },
  mutateJudgementPosition (state, data) {
    state.player.config.judgementPosition = data.value
  },
  mutateHitPosition (state, data) {
    state.player.config.hitPosition = data.value
  },
  toggleEffectsOn (state, data) {
    state.player.config.effectsOn = data.value
  },
  toggleShowFps (state, data) {
    state.player.config.showFps = data.value
  },
  mutateName (state, data) {
    state.player.config.name = data.value
  },
  mutateKeyBind (state, data) {
    state.player.keyConfigs[state.player.keyMode][data.id].code = data.code
    state.player.keyConfigs[state.player.keyMode][data.id].key = data.key
  },
  mutateKeyMode (state, data) {
    state.player.keyMode = data.value
  },
  mutateGameMode (state, data) {
    state.player.gameMode = data.value
  },
  addResource(state, data) {
    state.player.resources[data.id] += data.value
  },
  addSkill(state, data) {
    state.player.skills[data.id] += data.value
  },
  addSetup(state, data) {
    state.player.setup[data.id] += data.value
  },
  addCheat(state, data) {
    state.player.cheats[data.id] += data.value
  },
  toggleUpgrade(state, data) {
    state.player.upgrades[data.id] = data.value
  },
  toggleAchievement(state, data) {
    state.player.achievements[data.id] = data.value
  },
  reset(state, data) {
    state.player = {
      config: {
        name: data.value,
        time: 0,
        version: 0.1,
        comboPosition: 1080 * 0.3,
        judgementPosition: 1080 * 0.6,
        hitPosition: 164,
        effectsOn: true,
        showFps: true,
        scrollSpeed: 31,
        bpm: 180,
        fps: 0,
        od: 0,
        skin: 'bars',
      },
      keyMode: 7,
      gameMode: 'practice',
      stats: {
        startTime: Date.now(),
        rebirths: 0,
      },
      keyConfigs: {
        1: [
          { code: 'Space', key: ' ' },
        ],
        2: [
          { code: 'KeyF', key: 'F' },
          { code: 'KeyJ', key: 'J' },
        ],
        3: [
          { code: 'KeyF', key: 'F' },
          { code: 'Space', key: ' ' },
          { code: 'KeyJ', key: 'J' },
        ],
        4: [
          { code: 'KeyD', key: 'D' },
          { code: 'KeyF', key: 'F' },
          { code: 'KeyJ', key: 'J' },
          { code: 'KeyK', key: 'K' },
        ],
        5: [
          { code: 'KeyD', key: 'D' },
          { code: 'KeyF', key: 'F' },
          { code: 'Space', key: ' ' },
          { code: 'KeyJ', key: 'J' },
          { code: 'KeyK', key: 'K' },
        ],
        6: [
          { code: 'KeyS', key: 'S' },
          { code: 'KeyD', key: 'D' },
          { code: 'KeyF', key: 'F' },
          { code: 'KeyJ', key: 'J' },
          { code: 'KeyK', key: 'K' },
          { code: 'KeyL', key: 'L' },
        ],
        7: [
          { code: 'KeyS', key: 'S' },
          { code: 'KeyD', key: 'D' },
          { code: 'KeyF', key: 'F' },
          { code: 'Space', key: ' ' },
          { code: 'KeyJ', key: 'J' },
          { code: 'KeyK', key: 'K' },
          { code: 'KeyL', key: 'L' },
        ]
      },
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
      config: state.player.config,
      keyMode: 1,
      gameMode: 'practice',
      stats: {
        time: state.player.stats.time,
        rebirths: state.player.stats.rebirths + 1,
      },
      keyConfigs: state.keyConfigs,
      resources: {
        experience: 0,
        money: 0,
        clout: 0,
        stamina: 0,
        combo: 0,
        genes: state.resources.genes + data.value,
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
  changeScrollSpeed ({ commit }, data) {
    commit('mutateScrollSpeed', data)
  },
  changeComboPosition ({ commit }, data) {
    commit('mutateComboPosition', data)
  },
  changeJudgementPosition ({ commit }, data) {
    commit('mutateJudgementPosition', data)
  },
  changeHitPosition({ commit }, data) {
    commit('mutateHitPosition', data)
  },
  changeOd ({ commit }, data) {
    commit('mutateOd', data)
  },
  changeBpm ({ commit }, data) {
    commit('mutateBpm', data)
    let bpmChangedEvent = new CustomEvent('bpmChanged');
    document.getElementById('gameCanvas').dispatchEvent(bpmChangedEvent);
  },
  changeFps ({ commit }, data) {
    commit('mutateFps', data)
    let fpsChangedEvent = new CustomEvent('fpsChanged');
    document.getElementById('gameCanvas').dispatchEvent(fpsChangedEvent);
  },
  changeSkin ({ commit }, data) {
    commit('mutateSkin', data)
    let skinChangedEvent = new CustomEvent('skinChanged');
    document.getElementById('gameCanvas').dispatchEvent(skinChangedEvent);
  },
  toggleEffectsOn ({ commit }, data) {
    commit('toggleEffectsOn', data)
  },
  toggleShowFps ({ commit }, data) {
    commit('toggleShowFps', data)
  },
  changeName ({ commit }, data) {
    commit('mutateName', data)
  },
  changeKeyMode({ commit }, data) {
    commit('mutateKeyMode', data)
    let keyModeChangedEvent = new CustomEvent('keyModeChanged');
    document.getElementById('gameCanvas').dispatchEvent(keyModeChangedEvent);
  },
  changeKeyBind({ commit }, data) {
    commit('mutateKeyBind', data)
  },
  changeGameMode({ commit }, data) {
    commit('changeGameMode', data)
  },
  giveResource({ commit }, data) {
    commit('addResource', data)
  },
  buySkill({ state, commit }, data) {
    var cost = info.skills[data.id].costFunction(state.player.skills[data.id]) * data.value
    if(state.player.resources.experience < cost) return
    commit('addResource', {
      id: 'experience',
      value: -cost
    })
    commit('addSkill', data)
  },
  buySetup({ state, commit }, data) {
    var cost = info.setup[data.id][state.player.setup[data.id]].cost * data.value
    if(state.player.resources.money < cost) return
    commit('addResource', {
      id: 'money',
      value: -cost
    })
    commit('addSetup', data)
  },
  buyCheat({ state, commit }, data) {
    var cost = info.cheats[data.id].cost(state.player.cheats[data.id]) * data.value
    if(state.player.resources.clout < cost) return
    commit('addResource', {
      id: 'clout',
      value: -cost
    })
    commit('addCheat', data)
  },
  unlockUpgrade({ state, commit }, data) {
    var cost = info.upgrades[data.id].cost
    if(state.player.upgrades[data.id] == true || state.player.resources.experience < info.upgrades[data.id].cost) return
    commit('addResource', {
      id: 'experience',
      value: -cost
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
  exportGame({ commit }, data) {
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
      value: player
    })
  },
  resetGame({ commit }, data) {
    commit('reset', data)
  },
  breakCombo({ state, commit }) {
    commit('addResource', { id: 'combo', value: -state.player.resources.combo})
  },
  rebirth({ commit }) {
    commit('rebirth')
  },
  processKeyTap({ getters, dispatch }, data) {
    dispatch('process', { value: data.value * getters.keysPerTap })
  },
  processTimeFrame({ getters, dispatch}, data) {
    dispatch('process', { value: data.value * getters.keysPerSecond * getters.keysPerTap })
  },
  process({ dispatch }, data) {
    dispatch('giveResource', {id: 'experience', value: data.value})
    dispatch('giveResource', {id: 'combo', value: data.value})
  }
}

// getters are functions.
const getters = {
  loading: state => state.loading,
  importExportText: state => state.importExportText,
  effectsOn: state => state.player.config.effectsOn,
  showFps: state => state.player.config.showFps,
  scrollSpeed: state => state.player.config.scrollSpeed,
  comboPosition: state => state.player.config.comboPosition,
  judgementPosition: state => state.player.config.judgementPosition,
  hitPosition: state => state.player.config.hitPosition,
  bpm: state => state.player.config.bpm,
  fps: state => state.player.config.fps,
  od: state => state.player.config.od,
  skin: state => state.player.config.skin,
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
  currentKeys: state => state.player.keyConfigs[state.player.keyMode],
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
