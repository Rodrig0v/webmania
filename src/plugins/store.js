import Vue from 'vue'
import Vuex from 'vuex'
import LZString from 'lz-string'

Vue.use(Vuex)

// root state object.
// each Vuex instance is just a single state tree.
const state = {
  loading: true,
  configs: null,
}

// mutations are operations that actually mutate the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by plugins
// for debugging purposes.
const mutations = {
  /* Game */
  mutateLoading(state, data) {
    state.loading = data.value
  },
  mutateConfigs(state, data) {
    state.configs = data.value
  },
  resetGame(state) {
    state.configs = {
      general: {
        fps: 255,
        name: 'Jadong',
        audioOffset: 0,
        visualOffset: 0,
        scrollSpeed: 444,
        volume: 0.3,
        fullscreen: true,
      },
      skin: {
        accuracySize: 0.05,
        backgroundOpacity: 0.4,
        bmsStyle: 'bmsnone',
        columnSize: 0.05,
        comboPosition: 0.75,
        comboSize: 0.05,
        effectSize: 0.15,
        fpsSize: 0.05,
        hitPosition: 0.1,
        infoSize: 0.025,
        judgementBounce: 0.5,
        judgementPosition: 0.4,
        judgementSize: 0.07,
        judgementsSize: 0.05,
        laneCoverBottomFade: 0.1,
        laneCoverBottomPosition: 0.1,
        laneCoverTopFade: 0.1,
        laneCoverTopPosition: 0.1,
        offsetSizeX: 0.25,
        offsetSizeY: 0.05,
        showAccuracy: true,
        showBackground: true,
        showCombo: true,
        showEffects: true,
        showFps: false,
        showHint: true,
        showInfo: true,
        showJudgement: true,
        showJudgements: true,
        showLaneCoverBottom: false,
        showLaneCoverTop: false,
        showLighting: true,
        showOffset: true,
        showReceptors: true,
        showSongMeter: true,
        skin: 'arrowsColor',
        songMeterSize: 0.05,
        upScroll: false,
      },
      version: 0.4,
      patterns: [],
      keyBindings: {
        fullScreen: { code: 'Tab', key: 'Tab' },
        incrementAudioOffset: { code: 'Equal', key: '=' },
        decrementAudioOffset: { code: 'Minus', key: '-' },
        pause: { code: 'Backquote', key: '`' },
        restart: { code: 'KeyR', key: 'R' },
        1: [
          { code: 'Space', key: 'SPACE' },
        ],
        2: [
          { code: 'KeyF', key: 'F' },
          { code: 'KeyJ', key: 'J' },
        ],
        3: [
          { code: 'KeyF', key: 'F' },
          { code: 'Space', key: 'SPACE' },
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
          { code: 'Space', key: 'SPACE' },
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
          { code: 'Space', key: 'SPACE' },
          { code: 'KeyJ', key: 'J' },
          { code: 'KeyK', key: 'K' },
          { code: 'KeyL', key: 'L' },
        ],
        8: [
          { code: 'KeyA', key: 'A' },
          { code: 'KeyS', key: 'S' },
          { code: 'KeyD', key: 'D' },
          { code: 'KeyF', key: 'F' },
          { code: 'KeyJ', key: 'J' },
          { code: 'KeyK', key: 'K' },
          { code: 'KeyL', key: 'L' },
          { code: 'Semicolon', key: ';' },
        ],
        9: [
          { code: 'KeyA', key: 'A' },
          { code: 'KeyS', key: 'S' },
          { code: 'KeyD', key: 'D' },
          { code: 'KeyF', key: 'F' },
          { code: 'Space', key: 'SPACE' },
          { code: 'KeyJ', key: 'J' },
          { code: 'KeyK', key: 'K' },
          { code: 'KeyL', key: 'L' },
          { code: 'Semicolon', key: ';' },
        ],
        10: [
          { code: 'KeyA', key: 'A' },
          { code: 'KeyS', key: 'S' },
          { code: 'KeyD', key: 'D' },
          { code: 'KeyF', key: 'F' },
          { code: 'Space', key: 'SPACE' },
          { code: 'ArrowRight', key: 'ARROWRIGHT' },
          { code: 'Numpad4', key: '4' },
          { code: 'Numpad5', key: '5' },
          { code: 'Numpad6', key: '6' },
          { code: 'NumpadAdd', key: '+' },
        ]
      },
      challenges: {

      },
      achievements: {

      }
    }
  },
  resetSkin (state) {
    state.configs.skin = {
      accuracySize: 0.05,
      backgroundOpacity: 0.4,
      bmsStyle: 'bmsnone',
      columnSize: 0.05,
      comboPosition: 0.75,
      comboSize: 0.05,
      effectSize: 0.15,
      fpsSize: 0.05,
      hitPosition: 0.1,
      infoSize: 0.025,
      judgementBounce: 0.5,
      judgementPosition: 0.4,
      judgementSize: 0.07,
      judgementsSize: 0.05,
      laneCoverBottomFade: 0.1,
      laneCoverBottomPosition: 0.1,
      laneCoverTopFade: 0.1,
      laneCoverTopPosition: 0.1,
      offsetSizeX: 0.25,
      offsetSizeY: 0.05,
      showAccuracy: true,
      showBackground: true,
      showCombo: true,
      showEffects: true,
      showFps: false,
      showHint: true,
      showInfo: true,
      showJudgement: true,
      showJudgements: true,
      showLaneCoverBottom: false,
      showLaneCoverTop: false,
      showLighting: true,
      showOffset: true,
      showReceptors: true,
      showSongMeter: true,
      skin: 'arrowsColor',
      songMeterSize: 0.05,
      upScroll: false,
    }
  },
  /* General */
  mutateGeneralParameter (state, data) {
    state.configs.general[data.id] = data.value
  },
  /* Skin */
  mutateSkinParameter (state, data) {
    state.configs.skin[data.id] = data.value
  },
  /* Key Bindings */
  mutateKeyBind (state, data) {
    state.configs.keyBindings[data.id] = data.value
  },
  mutateHitKeyBinds (state, data) {
    state.configs.keyBindings[data.id] = data.values
  },
  /* Achievements */
  mutateAchievement (state, data) {
    state.configs.achievements[data.id] = data.value
  }
}

// actions are functions that cause side effects and can involve
// asynchronous operations.
const actions = {
  /* Game */
  changeLoading({ commit }, data) {
    commit('mutateLoading', data)
  },
  saveGame({ state }) {
    localStorage.setItem('webmania', LZString.compressToBase64(JSON.stringify(state.configs)))
  },
  loadGame({ commit }) {
    var configs;
    try {
      configs = JSON.parse(LZString.decompressFromBase64(localStorage.getItem('webmania')))
    } catch(Exception) {
      return
    }

    if(configs.version <= 0.31) {
      configs.general.fullscreen = true
      configs.skin.bmsStyle = 'bmsnone'
      configs.skin.judgementBounce = 0.5
      configs.skin.laneCoverBottomFade = 0.1
      configs.skin.laneCoverBottomPosition = 0.1
      configs.skin.laneCoverTopFade = 0.1
      configs.skin.laneCoverTopPosition = 0.1
      configs.skin.showLaneCoverBottom = false
      configs.skin.showLaneCoverTop = false
      configs.keyBindings[8] = [
        { code: 'KeyA', key: 'A' },
        { code: 'KeyS', key: 'S' },
        { code: 'KeyD', key: 'D' },
        { code: 'KeyF', key: 'F' },
        { code: 'KeyJ', key: 'J' },
        { code: 'KeyK', key: 'K' },
        { code: 'KeyL', key: 'L' },
        { code: 'Semicolon', key: ';' },
      ],
      configs.keyBindings[9] = [
        { code: 'KeyA', key: 'A' },
        { code: 'KeyS', key: 'S' },
        { code: 'KeyD', key: 'D' },
        { code: 'KeyF', key: 'F' },
        { code: 'Space', key: 'SPACE' },
        { code: 'KeyJ', key: 'J' },
        { code: 'KeyK', key: 'K' },
        { code: 'KeyL', key: 'L' },
        { code: 'Semicolon', key: ';' },
      ],
      configs.keyBindings[10] = [
        { code: 'KeyA', key: 'A' },
        { code: 'KeyS', key: 'S' },
        { code: 'KeyD', key: 'D' },
        { code: 'KeyF', key: 'F' },
        { code: 'Space', key: 'SPACE' },
        { code: 'ArrowRight', key: 'ARROWRIGHT' },
        { code: 'Numpad4', key: '4' },
        { code: 'Numpad5', key: '5' },
        { code: 'Numpad6', key: '6' },
        { code: 'NumpadAdd', key: '+' },
      ]
      configs.version = 0.4
    }
    commit('mutateConfigs', {
      value: configs
    })
  },
  resetGame({ commit }) {
    commit('resetGame')
    let canvas = document.getElementById('gameCanvas')
    if(canvas != null) {
      let resetGameEvent = new CustomEvent('resetGame')
      canvas.dispatchEvent(resetGameEvent)
    }
  },
  resetSkin({ commit }) {
    commit('resetSkin')
    let canvas = document.getElementById('gameCanvas')
    if(canvas != null) {
      let skinChangedEvent = new CustomEvent('skinChanged')
      canvas.dispatchEvent(skinChangedEvent)
    }
  },
  /* General */
  changeGeneralParameter ({ commit }, data) {
    commit('mutateGeneralParameter', data)
  },
  changeVolume ({ commit }, data) {
    commit('mutateGeneralParameter', { id: 'volume', value: data.value })
    let canvas = document.getElementById('gameCanvas')
    if(canvas != null) {
      let volumeChangedEvent = new CustomEvent('volumeChanged')
      canvas.dispatchEvent(volumeChangedEvent)
    }
  },
  changeFps ({ commit }, data) {
    commit('mutateGeneralParameter', { id: 'fps', value: data.value })
    let canvas = document.getElementById('gameCanvas')
    if(canvas != null) {
      let fpsChangedEvent = new CustomEvent('fpsChanged')
      canvas.dispatchEvent(fpsChangedEvent)
    }
  },
  /* Skin */
  changeSkinParameter ({ commit }, data) {
    commit('mutateSkinParameter', data)
  },
  changeSkinParameterWithEvent ({ commit }, data) {
    commit('mutateSkinParameter', data)
    let canvas = document.getElementById('gameCanvas')
    if(canvas != null) {
      let skinChangedEvent = new CustomEvent('skinChanged')
      canvas.dispatchEvent(skinChangedEvent)
    }
  },
  /* Key Bindings */
  changeHitKeyBinds({ commit }, data) {
    commit('mutateHitKeyBinds', data)
  },
  changeKeyBind({ commit }, data) {
    commit('mutateKeyBind', data)
  },
  /* Achievements */
  unlockAchievement({ state, commit }, data) {
    if(state.configs.achievements[data.id] == true) return
    commit('mutateAchievement', { id: data.id, value: true })
  },
}

// getters are functions.
const getters = {
  /* Game */
  loading: state => state.loading,
  /* General */
  name: state => state.configs.general.name,
  scrollSpeed: state => state.configs.general.scrollSpeed,
  audioOffset: state => state.configs.general.audioOffset,
  visualOffset: state => state.configs.general.visualOffset,
  volume: state => state.configs.general.volume,
  fps: state => state.configs.general.fps,
  /* Skin */
  accuracySize: state => state.configs.skin.accuracySize,
  backgroundOpacity: state => state.configs.skin.backgroundOpacity,
  bmsStyle:  state => state.configs.skin.bmsStyle,
  columnSize: state => state.configs.skin.columnSize,
  comboPosition: state => state.configs.skin.comboPosition,
  comboSize: state => state.configs.skin.comboSize,
  effectSize: state => state.configs.skin.effectSize,
  fpsSize: state => state.configs.skin.fpsSize,
  fullscreen: state => state.configs.general.fullscreen,
  hitPosition: state => state.configs.skin.hitPosition,
  infoSize: state => state.configs.skin.infoSize,
  judgementBounce: state => state.configs.skin.judgementBounce,
  judgementPosition: state => state.configs.skin.judgementPosition,
  judgementSize: state => state.configs.skin.judgementSize,
  judgementsSize: state => state.configs.skin.judgementsSize,
  laneCoverBottomFade: state => state.configs.skin.laneCoverBottomFade,
  laneCoverBottomPosition: state => state.configs.skin.laneCoverBottomPosition,
  laneCoverTopFade: state => state.configs.skin.laneCoverTopFade,
  laneCoverTopPosition: state => state.configs.skin.laneCoverTopPosition,
  offsetSizeX: state => state.configs.skin.offsetSizeX,
  offsetSizeY: state => state.configs.skin.offsetSizeY,
  showAccuracy: state => state.configs.skin.showAccuracy,
  showBackground: state => state.configs.skin.showBackground,
  showCombo: state => state.configs.skin.showCombo,
  showEffects: state => state.configs.skin.showEffects,
  showFps: state => state.configs.skin.showFps,
  showHint: state => state.configs.skin.showHint,
  showInfo: state => state.configs.skin.showInfo,
  showJudgement: state => state.configs.skin.showJudgement,
  showJudgements: state => state.configs.skin.showJudgements,
  showLaneCoverBottom: state => state.configs.skin.showLaneCoverBottom,
  showLaneCoverTop: state => state.configs.skin.showLaneCoverTop,
  showLighting: state => state.configs.skin.showLighting,
  showOffset: state => state.configs.skin.showOffset,
  showReceptors: state => state.configs.skin.showReceptors,
  showSongMeter: state => state.configs.skin.showSongMeter,
  skin: state => state.configs.skin.skin,
  songMeterSize: state => state.configs.skin.songMeterSize,
  upScroll: state => state.configs.skin.upScroll,
  /* Key Bindings */
  keyBindings: state => state.configs.keyBindings,
  /* Achievements */
  achievements: state => state.configs.achievements,
    
}

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
