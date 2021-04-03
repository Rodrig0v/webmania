<template>
  <div>
    <v-dialog
      v-model="calculatorDialog"
      max-width="350"
    >
      <v-card>
        <v-card-title class="headline">
          {{ $t('options.general.osutoms') }}
        </v-card-title>
        <v-card-text>
          <v-text-field
            :label="$t('options.general.scrollspeed')"
            type="number"
            v-model="osuScrollSpeed"
          ></v-text-field>
          <v-text-field
            :label="$t('options.general.hitposition')"
            type="number"
            v-model="osuHitPosition"
          ></v-text-field>
          <v-btn
            color="blue darken-1"
            @click="changeGeneralParameter({ id: 'scrollSpeed', value: 13720 * (osuHitPosition / 480) / osuScrollSpeed }); calculatorDialog = false;"
          >
            {{ $t('options.general.calculate')}}
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-text-field
      :label="$t('options.general.name')"
      v-model="computedName"
    ></v-text-field>
    <v-row class="my-0 mx-0">
      <v-text-field
        :label="$t('options.general.scrollspeed')"
        :rules="scrollSpeedRules"
        v-model="computedScrollSpeed"
      ></v-text-field>
      <v-btn
        color="blue darken-1"
        @click="calculatorDialog = true"
      >
        {{ $t('options.general.fromosu')}}
      </v-btn>
    </v-row>
    <v-text-field
      :label="$t('options.general.audioOffset')"
      :rules="offsetRules"
      v-model="computedAudioOffset"
    ></v-text-field>
    <v-text-field
      :label="$t('options.general.visualOffset')"
      :rules="offsetRules"
      v-model="computedVisualOffset"
    ></v-text-field>
    <v-text-field
      :label="$t('options.general.volume')"
      :rules="percentageRules"
      v-model="computedVolume"
    ></v-text-field>
    <v-text-field
      :label="$t('options.general.fps')"
      :rules="fpsRules"
      v-model="computedFps"
    ></v-text-field>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'OptionsGeneral',
  data() {
    return {
      calculatorDialog: false,
      osuScrollSpeed: 25,
      osuHitPosition: 402,
      percentageRules: [
        v  => !isNaN(Number(v)) ? true : this.$t('rules.number'),
        v  => v >= 0 && v <= 100 ? true : this.$t('rules.value', {min: 0, max: 100}),
      ],
      scrollSpeedRules: [
        v  => !isNaN(Number(v)) ? true : this.$t('rules.number'),
        v  => v >= 0 && v <= 9999 ? true : this.$t('rules.value', {min: 0, max: 9999}),
      ],
      offsetRules: [
        v  => !isNaN(Number(v)) ? true : this.$t('rules.number'),
        v  => v >= -9999 && v <= 9999 ? true : this.$t('rules.value', {min: -9999, max: 9999}),
      ],
      fpsRules: [
        v  => !isNaN(Number(v)) ? true : this.$t('rules.number'),
        v  => v >= 0 && v <= 255 ? true : this.$t('rules.value', {min: 0, max: 255}),
      ],
    };
  },
  computed: {
    ...mapGetters([
      'name',
      'scrollSpeed',
      'audioOffset',
      'visualOffset',
      'volume',
      'fps',
    ]),
    computedName: {
      get () {
        return this.name
      },
      set (value) {
        this.changeGeneralParameter({ id: 'name', value: value })
      }
    },
    computedScrollSpeed: {
      get () {
        return this.scrollSpeed
      },
      set (value) {
        let number = Number(value)
        for(var rule of this.scrollSpeedRules) {
          if (rule(number) != true) return
        }
        this.changeGeneralParameter({ id: 'scrollSpeed', value: number })
      }
    },
    computedAudioOffset: {
      get () {
        return this.audioOffset
      },
      set (value) {
        let number = Number(value)
        for(var rule of this.offsetRules) {
          if (rule(number) != true) return
        }
        this.changeGeneralParameter({ id: 'audioOffset', value: number })
      }
    },
    computedVisualOffset: {
      get () {
        return this.visualOffset
      },
      set (value) {
        let number = Number(value)
        for(var rule of this.offsetRules) {
          if (rule(number) != true) return
        }
        this.changeGeneralParameter({ id: 'visualOffset', value: number })
      }
    },
    computedVolume: {
      get () {
        return this.volume * 100
      },
      set (value) {
        let number = Number(value)
        for(var rule of this.percentageRules) {
          if (rule(number) != true) return
        }
        this.changeVolume({ value: number / 100 })
      }
    },
    computedFps: {
      get () {
        return this.fps
      },
      set (value) {
        let number = Number(value)
        for(var rule of this.fpsRules) {
          if (rule(number) != true) return
        }
        this.changeFps({ value: number })
      }
    },
  },
  methods: mapActions([
      'changeGeneralParameter',
      'changeVolume',
      'changeFps',
    ]),
}
</script>