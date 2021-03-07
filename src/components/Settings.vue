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
    <v-switch
      v-model="computedShowFps"
      :label="$t('settings.showfps')"
    ></v-switch>
    <v-text-field
      :label="$t('settings.volume')"
      v-model="computedVolume"
      hide-details="auto"
    ></v-text-field>
    <v-switch
      v-model="computedSoundOn"
      :label="$t('settings.enablesound')"
    ></v-switch>
    <v-select
      :items="keyModes"
      v-model="computedKeyMode"
      :label="$t('settings.keymode')"
    ></v-select>
    <v-select
      :items="ods"
      v-model="computedOd"
      :label="$t('settings.od')"
    ></v-select>
    <h1>{{ $t('settings.skin') }}</h1>
    <v-select
      :items="skins"
      v-model="computedSkin"
      :label="$t('settings.skin')"
    ></v-select>
    <v-text-field
      :label="$t('settings.comboposition')"
      v-model="computedComboPosition"
      hide-details="auto"
    ></v-text-field>
    <v-text-field
      :label="$t('settings.judgementposition')"
      v-model="computedJudgementPosition"
      hide-details="auto"
    ></v-text-field>
    <v-text-field
      :label="$t('settings.hitposition')"
      v-model="computedHitPosition"
      hide-details="auto"
    ></v-text-field>
    <!--v-text-field
      :label="$t('settings.importcode')"
      v-model="importExportText"
      hide-details="auto"
    ></v-text-field>
    <v-btn color="primary" @click="importPlayer">{{ $t('settings.import') }}</v-btn>
    <v-btn color="primary" @click="exportPlayer">{{ $t('settings.export') }}</v-btn-->
    <v-btn color="primary" @click="reset">{{ $t('settings.reset') }}</v-btn>
    <v-btn color="primary" @click="fullscreen">{{ $t('settings.fullscreen') }}</v-btn>
    <h1>{{ $t('settings.keybinds') }}</h1>
    <div>
      <v-btn color="primary" v-for="(key, index) in currentKeys" :key="index" @click="keyBind(index)" >{{ key.key | space }}</v-btn>
    </div>
    <v-dialog
      v-model="keybindDialog"
      max-width="290"
      persistent
    >
      <v-card>
        <v-card-title class="headline">
          {{ $t('settings.changekeybind') }}
        </v-card-title>
        <v-card-text>
          {{ $t('settings.presskey') }}
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import LZString from 'lz-string'
import info from '../models/info'

export default {
  name: 'Settings',
  data() {
    return {
      keyModes: [1,2,3,4,5,6,7],
      ods: Object.keys(info.judgementWindows).map(key => Number(key)),
      skins: Object.keys(info.skins),
      importExportText: null,
      keybindDialog: false,
      keyBeingChanged: null,
    }
  },
  computed: {
    ...mapGetters([
      'bpm',
      'scrollSpeed',
      'fps',
      'od',
      'skin',
      'keyMode',
      'currentKeys',
      'showFps',
      'comboPosition',
      'judgementPosition',
      'hitPosition',
      'volume',
      'soundOn'
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
    computedShowFps: {
      get () {
        return this.showFps
      },
      set (value) {
        this.toggleShowFps({ value: value })
      }
    },
    computedOd: {
      get () {
        return this.od
      },
      set (value) {
        this.changeOd({ value: value })
      }
    },
    computedSkin: {
      get () {
        return this.skin
      },
      set (value) {
        this.changeSkin({ value: value })
      }
    },
    computedKeyMode: {
      get () {
        return this.keyMode
      },
      set (value) {
        this.changeKeyMode({ value: value })
      }
    },
    computedComboPosition: {
      get () {
        return this.comboPosition
      },
      set (value) {
        this.changeComboPosition({ value: value })
      }
    },
    computedJudgementPosition: {
      get () {
        return this.judgementPosition
      },
      set (value) {
        this.changeJudgementPosition({ value: value })
      }
    },
    computedHitPosition: {
      get () {
        return this.hitPosition
      },
      set (value) {
        this.changeHitPosition({ value: value })
      }
    },
    computedSoundOn: {
      get () {
        return this.soundOn
      },
      set (value) {
        this.toggleSoundOn({ value: value })
      }
    },
    computedVolume: {
      get () {
        return this.volume * 100
      },
      set (value) {
        this.changeVolume({ value: value / 100 })
      }
    },
  },
  methods: {
    ...mapActions([
      'importGame',
      'resetGame',
      'changeBpm',
      'changeScrollSpeed',
      'changeFps',
      'changeOd',
      'changeSkin',
      'changeKeyMode',
      'changeKeyBind',
      'changeComboPosition',
      'changeJudgementPosition',
      'changeHitPosition',
      'changeVolume',
      'toggleShowFps',
      'toggleSoundOn',
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
    },
    keyBind(id) {
      this.keyBeingChanged = id
      this.keybindDialog = true
      addEventListener("keydown", this.newKeyBind)
    },
    newKeyBind(event) {
      removeEventListener("keydown", this.newKeyBind)
      this.changeKeyBind({ id: this.keyBeingChanged, key: event.key == 'Dead' ? event.code : event.key, code: event.code})
      this.keybindDialog = false
      this.keyBeingChanged = null
    }
  }
}
</script>