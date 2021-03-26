<template>
  <div>
    <KeyBindInput v-model="computedPauseKey" :label="$t('options.keybinds.pause')"/>
    <KeyBindInput v-model="computedRestartKey" :label="$t('options.keybinds.restart')"/>
    <KeyBindInput v-model="computedFullScreenKey" :label="$t('options.keybinds.fullscreen')"/>
    <KeyBindInput v-model="computedIncrementAudioOffsetKey" :label="$t('options.keybinds.incrementoffset')"/>
    <KeyBindInput v-model="computedDecrementAudioOffsetKey" :label="$t('options.keybinds.decrementoffset')"/>

    <v-tabs v-model="tab" grow>
      <v-tab v-for="(keyMode) in keyModes" :key="keyMode">
        {{ keyMode }} K
      </v-tab>
    </v-tabs>

    <KeyBindInput v-model="computedHitKeys" :showIndex="true" :label="$t('options.keybinds.column')"/>

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import KeyBindInput from './KeyBindInput'

export default {
  name: 'OptionsKeyBinds',
  components: {
    KeyBindInput,
  },
  data() {
    return {
      tab: null,
      keybindDialog: false,
      keyId: null,
      keyModes: [1,2,3,4,5,6,7]
    };
  },
  computed: {
    ...mapGetters([
      'keyBindings',
    ]),
    computedFullScreenKey: {
      get () {
        return [this.keyBindings['fullScreen']]
      },
      set (values) {
        this.changeKeyBind({ id: 'fullScreen', value: values[0] })
      }
    },
    computedIncrementAudioOffsetKey: {
      get () {
        return [this.keyBindings['incrementAudioOffset']]
      },
      set (values) {
        this.changeKeyBind({ id: 'incrementAudioOffset', value: values[0] })
      }
    },
    computedDecrementAudioOffsetKey: {
      get () {
        return [this.keyBindings['decrementAudioOffset']]
      },
      set (values) {
        this.changeKeyBind({ id: 'decrementAudioOffset', value: values[0] })
      }
    },
    computedPauseKey: {
      get () {
        return [this.keyBindings['pause']]
      },
      set (values) {
        this.changeKeyBind({ id: 'pause', value: values[0] })
      }
    },
    computedRestartKey: {
      get () {
        return [this.keyBindings['restart']]
      },
      set (values) {
        this.changeKeyBind({ id: 'restart', value: values[0] })
      }
    },
    computedHitKeys: {
      get () {
        return this.keyBindings[this.tab + 1]
      },
      set (values) {
        this.changeHitKeyBinds({ id: this.tab + 1, values })
      }
    }
  },
  methods: {
    ...mapActions([
      'changeHitKeyBinds',
      'changeKeyBind',
  ]),
},

}
</script>