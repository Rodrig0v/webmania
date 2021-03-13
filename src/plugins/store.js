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
  /* Game */
  toggleLoading(state, data) {
    state.loading = data.value
  },
  mutateCombo(state, data) {
    state.player.gameplay.combo = data.value
  },
  mutateJudgement(state, data) {
    state.player.gameplay.judgement[data.id] = data.value
  },
  mutateScore(state, data) {
    state.player.gameplay.score = data.value
  },
  mutateAccuracy(state, data) {
    state.player.gameplay.accuracy = data.value
  },
  mutatePlayer(state, data) {
    state.player = data.value
  },
  mutateTime (state, data) {
    state.player.config.time = data.value
  },
  mutateVolume (state, data) {
    state.player.config.volume = data.value
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
    state.player.skin.skin = data.value
  },
  mutateHitPosition (state, data) {
    state.player.skin.hitPosition = data.value
  },
  mutateColumnSize (state, data) {
    state.player.skin.columnSize = data.value
  },
  mutateJudgementPosition (state, data) {
    state.player.skin.judgementPosition = data.value
  },
  mutateJudgementSize (state, data) {
    state.player.skin.judgementSize = data.value
  },
  mutateComboPosition (state, data) {
    state.player.skin.comboPosition = data.value
  },
  mutateComboSize (state, data) {
    state.player.skin.comboSize = data.value
  },
  mutateEffectSize (state, data) {
    state.player.skin.EffectSize = data.value
  },
  toggleSoundOn (state, data) {
    state.player.config.soundOn = data.value
  },
  toggleShowJudgements (state, data) {
    state.player.config.showJudgements = data.value
  },
  toggleShowFps (state, data) {
    state.player.config.showFps = data.value
  },
  mutateName (state, data) {
    state.player.config.name = data.value
  },
  mutateKeyBind (state, data) {
    state.player.keyConfigs[data.mode][data.id].code = data.code
    state.player.keyConfigs[data.mode][data.id].key = data.key
  },
  mutateKeyMode (state, data) {
    state.player.keyMode = data.value
  },
  mutateGameMode (state, data) {
    state.player.gameMode = data.value
  },
  reset(state, data) {
    state.player = {
      config: {
        bpm: 191,
        fps: 255,
        name: data.value,
        od: 0,
        scrollSpeed: 444,
        showFps: true,
        showJudgements: true,
        soundOn: true,
        volume: 0.2,
      },
      skin: {
          skin: 'bars',
          columnSize: 0.05,
          comboPosition: 0.75,
          comboSize: 0.05,
          judgementPosition: 0.4,
          judgementSize: 0.07,
          hitPosition: 0.1,
          effectSize: 0.15
      },
      gameplay: {
        accuracy: 0,
        combo: 0,
        judgements: [0,0,0,0,0,0],
        score: 0,
      },
      version: 0.2,
      time: Date.now(),
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
        clout: 0,
        experience: 0,
        genes: 0,
        money: 0,
        stamina: 0,
      },
      skills: {
        accuracy: 0,
        focus: 0,
        jacks: 0,
        reading: 0,
        technique: 0,
        trilling: 0,
      },
      setup: {
        chair: 0,
        headset: 0,
        keyboard: 0,
        monitor: 0,
        pc: 0,
      },
      upgrades: {
        0: false,
        1: false,
        2: false,
        3: false,
      },
      cheats: {
        pause: 0,
        macro: 0,
        bot: 0,
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
        firststream: false,
        firsttournament: false,
        foolmoon: false
      },
      mutations: {
        xp: 0,
      },
    }
  },
  /* Idle */
  toggleShift(state, data) {
    state.shift = data.value
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
  rebirth(state, data) {
    state.player = {
      config: state.player.config,
      skin: state.player.skin,
      gameplay: {
        accuracy: 0,
        combo: 0,
        judgements: [0,0,0,0,0,0],
        score: 0,
      },
      time: state.player.time,
      version: state.player.version,
      keyMode: 1,
      gameMode: 'practice',
      stats: {
        time: state.player.stats.time,
        rebirths: state.player.stats.rebirths + 1,
      },
      keyConfigs: state.keyConfigs,
      resources: {
        clout: 0,
        experience: 0,
        genes: state.resources.genes + data.value,
        money: 0,
        stamina: 0,
      },
      skills: {
        accuracy: 0,
        focus: 0,
        jacks: 0,
        reading: 0,
        technique: 0,
        trilling: 0,
      },
      setup: {
        chair: 0,
        headset: 0,
        keyboard: 0,
        monitor: 0,
        pc: 0,
      },
      upgrades: {
        0: false,
        1: false,
        2: false,
        3: false,
      },
      cheats: {
        pause: 0,
        macro: 0,
        bot: 0,
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
  /* Game */
  toggleLoading({ commit }, data) {
    commit('toggleLoading', data)
  },
  changeCombo({ commit }, data) {
    commit('mutateCombo', data)
  },
  changeScore({ commit }, data) {
    commit('mutateScore', data)
  },
  changeJudgement({ commit }, data) {
    commit('mutateJudgement', data)
  },
  changeAccuracy({ commit }, data) {
    commit('mutateAccuracy', data)
  },
  changeScrollSpeed ({ commit }, data) {
    commit('mutateScrollSpeed', data)
  },
  changeVolume ({ commit }, data) {
    commit('mutateVolume', data)
    let volumeChangedEvent = new CustomEvent('volumeChanged')
    document.getElementById('gameCanvas').dispatchEvent(volumeChangedEvent)
  },
  changeColumnSize ({ commit }, data) {
    commit('mutateColumnSize', data)
  },
  changeHitPosition ({ commit }, data) {
    commit('mutateHitPosition', data)
  },
  changeJudgementPosition ({ commit }, data) {
    commit('mutateJudgementPosition', data)
  },
  changeJudgementSize ({ commit }, data) {
    commit('mutateJudgementSize', data)
  },
  changeComboPosition ({ commit }, data) {
    commit('mutateComboPosition', data)
  },
  changeComboSize ({ commit }, data) {
    commit('mutateComboSize', data)
  },
  changeEffectSize ({ commit }, data) {
    commit('mutateEffectSize', data)
  },
  changeOd ({ commit }, data) {
    commit('mutateOd', data)
  },
  changeBpm ({ commit }, data) {
    commit('mutateBpm', data)
    let canvas = document.getElementById('gameCanvas')
    if(canvas != null) {
      let bpmChangedEvent = new CustomEvent('bpmChanged')
      canvas.dispatchEvent(bpmChangedEvent)
    }
  },
  changeFps ({ commit }, data) {
    commit('mutateFps', data)
    let canvas = document.getElementById('gameCanvas')
    if(canvas != null) {
      let fpsChangedEvent = new CustomEvent('fpsChanged')
      canvas.dispatchEvent(fpsChangedEvent)
    }
  },
  changeSkin ({ commit }, data) {
    commit('mutateSkin', data)
    let canvas = document.getElementById('gameCanvas')
    if(canvas != null) {
      let skinChangedEvent = new CustomEvent('skinChanged')
      canvas.dispatchEvent(skinChangedEvent)
    }
  },
  toggleSoundOn ({ commit }, data) {
    commit('toggleSoundOn', data)
    let canvas = document.getElementById('gameCanvas')
    if(canvas != null) {
      let soundChangedEvent = new CustomEvent('soundChanged')
      canvas.dispatchEvent(soundChangedEvent)
    }
  },
  toggleShowFps ({ commit }, data) {
    commit('toggleShowFps', data)
  },
  changeName ({ commit }, data) {
    commit('mutateName', data)
  },
  changeKeyMode({ commit }, data) {
    commit('mutateKeyMode', data)
    let canvas = document.getElementById('gameCanvas')
    if(canvas != null) {
      let keyModeChangedEvent = new CustomEvent('keyModeChanged')
      canvas.dispatchEvent(keyModeChangedEvent)
    }
  },
  changeKeyBind({ commit }, data) {
    commit('mutateKeyBind', data)
  },
  changeGameMode({ commit }, data) {
    commit('changeGameMode', data)
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
    let canvas = document.getElementById('gameCanvas')
    if(canvas != null) {
      let resetGameEvent = new CustomEvent('resetGame')
      canvas.dispatchEvent(resetGameEvent)
    }
  },
  breakCombo({ commit }) {
    commit('mutateCombo', { value: 0 })
  },
  /* Idle */
  toggleShift({ commit }, data) {
    commit('toggleShift', data)
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
  rebirth({ commit }) {
    commit('rebirth')
  },
  processKeyTap({ getters, dispatch }, data) {
    dispatch('process', { value: data.value * getters.keysPerTap })
  },
  processTimeFrame({ getters, dispatch}, data) {
    dispatch('process', { value: data.value * getters.keysPerSecond * getters.keysPerTap })
  },
  process({ getters, dispatch }, data) {
    dispatch('giveResource', {id: 'experience', value: data.value})
    dispatch('changeCombo', { value: getters.combo + 1})
  }
}

// getters are functions.
const getters = {
  /* Game */
  accuracy: state => state.player.gameplay.accuracy,
  allKeys: state => state.player.keyConfigs,
  bpm: state => state.player.config.bpm,
  columnSize: state => state.player.skin.columnSize,
  combo: state => state.player.gameplay.combo,
  comboPosition: state => state.player.skin.comboPosition,
  comboSize: state => state.player.skin.comboSize,
  currentKeys: state => state.player.keyConfigs[state.player.keyMode],
  effectSize: state => state.player.skin.effectSize,
  fps: state => state.player.config.fps,
  gameMode: state => state.player.gameMode,
  hitPosition: state => state.player.skin.hitPosition,
  judgementPosition: state => state.player.skin.judgementPosition,
  judgementSize: state => state.player.skin.judgementSize,
  judgements: state => state.player.gameplay.judgements,
  keyMode: state => state.player.keyMode,
  loading: state => state.loading,
  name: state => state.player.config.name,
  od: state => state.player.config.od,
  score: state => state.player.gameplay.score,
  scrollSpeed: state => state.player.config.scrollSpeed,
  showFps: state => state.player.config.showFps,
  showJudgements: state => state.player.config.showJudgements,
  skin: state => state.player.skin.skin,
  soundOn: state => state.player.config.soundOn,
  volume: state => state.player.config.volume,
  /* Idle */
  achievements: state => state.player.achievements,
  cheats: state => state.player.cheats,
  clout: state => state.player.resources.clout,
  experience: state => state.player.resources.experience,
  genes: state => state.player.resources.genes,
  keysPerSecond: state => state.player.cheats.bot, //TODO
  keysPerTap: state => state.player.cheats.macro + 1, //TODO
  money: state => state.player.resources.money,
  mutations: state => state.player.mutations,
  pp: state => {
    var sum = 0
    for(var skill of Object.values(state.player.skills)) {
      sum += skill
    }
    return sum / (4 * state.player.keyMode)
  },
  setup: state => state.player.setup,
  skills: state => state.player.skills,
  stamina: state => state.player.resources.stamina,
  upgrades: state => state.player.upgrades,
    
}

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
