<template>
  <div>
    <v-text-field
      :label="$t('options.gameplay.name')"
      v-model="computedName"
    ></v-text-field>
    <v-text-field
      :label="$t('options.gameplay.scrollspeed')"
      :rules="scrollSpeedRules"
      v-model="computedScrollSpeed"
    ></v-text-field>
    <v-select
      :items="ods"
      v-model="computedOd"
      :label="$t('options.gameplay.od')"
    ></v-select>
    <v-switch
      v-model="computedShowFps"
      :label="$t('options.gameplay.showfps')"
    ></v-switch>
    <v-text-field
      :label="$t('options.gameplay.fps')"
      :rules="fpsRules"
      v-model="computedFps"
    ></v-text-field>
    <v-switch
      v-model="computedSoundOn"
      :label="$t('options.gameplay.mutesound')"
    ></v-switch>
    <v-text-field
      :label="$t('options.gameplay.volume')"
      :rules="percentageRules"
      v-model="computedVolume"
    ></v-text-field>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import info from '../models/info'

export default {
  name: 'OptionsGameplay',
  data() {
    return {
      ods: Object.keys(info.judgementWindows).map(key => Number(key)),
      percentageRules: [
        v  => !isNaN(Number(v)) ? true : this.$t('rules.number'),
        v  => v >= 0 && v <= 100 ? true : this.$t('rules.value', {min: 0, max: 100}),
      ],
      fpsRules: [
        v  => !isNaN(Number(v)) ? true : this.$t('rules.number'),
        v  => v >= 0 && v <= 255 ? true : this.$t('rules.value', {min: 0, max: 255}),
      ],
      scrollSpeedRules: [
        v  => !isNaN(Number(v)) ? true : this.$t('rules.number'),
        v  => v >= 0 && v <= 9999 ? true : this.$t('rules.value', {min: 0, max: 9999}),
      ],
    };
  },
  computed: {
    ...mapGetters([
      'name',
      'scrollSpeed',
      'od',
      'showFps',
      'fps',
      'soundOn',
      'volume',
    ]),
    computedName: {
      get () {
        return this.name
      },
      set (value) {
        this.changeName({ value: value })
      }
    },
    computedScrollSpeed: {
      get () {
        return this.scrollSpeed
      },
      set (value) {
        for(var rule of this.scrollSpeedRules) {
          if (rule(value) != true) return
        }
        this.changeScrollSpeed({ value: Number(value) })
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
    computedShowFps: {
      get () {
        return this.showFps
      },
      set (value) {
        this.toggleShowFps({ value: value })
      }
    },
    computedFps: {
      get () {
        return this.fps
      },
      set (value) {
        for(var rule of this.fpsRules) {
          if (rule(value) != true) return
        }
        this.changeFps({ value: Number(value) })
      }
    },
    computedSoundOn: {
      get () {
        return !this.soundOn
      },
      set (value) {
        this.toggleSoundOn({ value: !value })
      }
    },
    computedVolume: {
      get () {
        return this.volume * 100
      },
      set (value) {
        for(var rule of this.percentageRules) {
          if (rule(value) != true) return
        }
        this.changeVolume({ value: value / 100 })
      }
    },
  },
  methods: mapActions([
      'changeScrollSpeed',
      'changeOd',
      'toggleShowFps',
      'changeFps',
      'toggleSoundOn',
      'changeVolume',
    ]),
}
</script>