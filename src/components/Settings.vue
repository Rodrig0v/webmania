<template>
  <div>
    <h1>{{ $t('settings.name') }}</h1>
    <v-text-field
      :label="$t('settings.scrollspeed')"
      v-model="computedScrollSpeed"
      hide-details="auto"
    ></v-text-field>
    <v-text-field
      :label="$t('settings.bpm')"
      v-model="computedBpm"
      hide-details="auto"
    ></v-text-field>
    <v-text-field
      :label="$t('settings.fps')"
      v-model="computedFps"
      hide-details="auto"
    ></v-text-field>
    <v-text-field
      :label="$t('settings.importcode')"
      v-model="importExportText"
      hide-details="auto"
    ></v-text-field>
    <v-btn color="primary" @click="importPlayer">{{ $t('settings.import') }}</v-btn>
    <v-btn color="primary" @click="exportPlayer">{{ $t('settings.export') }}</v-btn>
    <v-btn color="primary" @click="reset">{{ $t('settings.reset') }}</v-btn>
    <v-btn color="primary" @click="fullscreen">{{ $t('settings.fullscreen') }}</v-btn>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import LZString from 'lz-string'

export default {
  name: 'Settings',
  data() {
    return {
      importExportText: null,
    }
  },
  computed: {
    ...mapGetters([
      'bpm',
      'scrollSpeed',
      'fps'
    ]),
    computedBpm: {
      get () {
        return this.bpm
      },
      set (value) {
        this.changeBpm({ value: Number(value) })
      }
    },
    computedScrollSpeed: {
      get () {
        return this.scrollSpeed
      },
      set (value) {
        this.changeScrollSpeed({ value: Number(value) })
      }
    },
    computedFps: {
      get () {
        return this.fps
      },
      set (value) {
        this.changeFps({ value: Number(value) })
      }
    },
  },
  methods: {
    ...mapActions([
      'importGame',
      'resetGame',
      'changeBpm',
      'changeScrollSpeed',
      'changeFps'
    ]),
    exportPlayer() {
      this.importExportText = LZString.compressToBase64(JSON.stringify(this.$store.state.player))
    },
    importPlayer() {
      if(this.importExportText == '') return
      var player;
      try {
        player = JSON.parse(LZString.decompressFromBase64(this.importExportText))
      } catch(Exception) {
        return
      }
      this.importGame({ player: player })
    },
    reset() {
      var playerName = prompt('Please enter your username', 'Jadong');
      if(playerName == null) playerName = 'Jadong'
      this.resetGame({ name: playerName })
    },
    fullscreen() {
      let makeFullscreenEvent = new CustomEvent('makeFullscreen')
      document.getElementById('gameCanvas').dispatchEvent(makeFullscreenEvent)
    }
  }
}
</script>