<template>
  <div>
    <KeyBindInput v-model="computedPauseKey" :label="$t('options.keybinds.pause')"/>
    <KeyBindInput v-model="computedRestartKey" :label="$t('options.keybinds.restart')"/>
    <KeyBindInput v-model="computedFullScreenKey" :label="$t('options.keybinds.fullscreen')"/>
    <KeyBindInput v-model="computedIncrementAudioOffsetKey" :label="$t('options.keybinds.incrementoffset')"/>
    <KeyBindInput v-model="computedDecrementAudioOffsetKey" :label="$t('options.keybinds.decrementoffset')"/>

    <KeyBindInput v-model="computed1K" label="1K"/>
    <KeyBindInput v-model="computed2K" label="2K"/>
    <KeyBindInput v-model="computed3K" label="3K"/>
    <KeyBindInput v-model="computed4K" label="4K"/>
    <KeyBindInput v-model="computed5K" label="5K"/>
    <KeyBindInput v-model="computed6K" label="6K"/>
    <KeyBindInput v-model="computed7K" label="7K"/>
    <KeyBindInput v-model="computed8K" label="8K"/>
    <KeyBindInput v-model="computed9K" label="9K"/>
    <KeyBindInput v-model="computed10K" label="10K"/>

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
    computed1K: {
      get () {
        return this.keyBindings[1]
      },
      set (values) {
        this.changeHitKeyBinds({ id: 1, values })
      }
    },
    computed2K: {
      get () {
        return this.keyBindings[2]
      },
      set (values) {
        this.changeHitKeyBinds({ id: 2, values })
      }
    },
    computed3K: {
      get () {
        return this.keyBindings[3]
      },
      set (values) {
        this.changeHitKeyBinds({ id: 3, values })
      }
    },
    computed4K: {
      get () {
        return this.keyBindings[4]
      },
      set (values) {
        this.changeHitKeyBinds({ id: 4, values })
      }
    },
    computed5K: {
      get () {
        return this.keyBindings[5]
      },
      set (values) {
        this.changeHitKeyBinds({ id: 5, values })
      }
    },
    computed6K: {
      get () {
        return this.keyBindings[6]
      },
      set (values) {
        this.changeHitKeyBinds({ id: 6, values })
      }
    },
    computed7K: {
      get () {
        return this.keyBindings[7]
      },
      set (values) {
        this.changeHitKeyBinds({ id: 7, values })
      }
    },
    computed8K: {
      get () {
        return this.keyBindings[8]
      },
      set (values) {
        this.changeHitKeyBinds({ id: 8, values })
      }
    },
    computed9K: {
      get () {
        return this.keyBindings[9]
      },
      set (values) {
        this.changeHitKeyBinds({ id: 9, values })
      }
    },
    computed10K: {
      get () {
        return this.keyBindings[10]
      },
      set (values) {
        this.changeHitKeyBinds({ id: 10, values })
      }
    },
  },
  methods: {
    ...mapActions([
      'changeHitKeyBinds',
      'changeKeyBind',
  ]),
},

}
</script>