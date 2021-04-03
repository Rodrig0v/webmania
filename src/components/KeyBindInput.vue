<template>
  <div class="d-flex flex-row align-center">
    <div class="mr-4">{{ label }}</div>
    <div class="white--text font-weight-bold mr-4" v-for="(keybind, index) of value" :key="index">{{ keybind.key }}</div>
    <v-btn
      color="blue darken-1"
      text
      @click="startInput()"
    >
      {{ $t('options.keybinds.change')}}
    </v-btn>

    <v-dialog
      v-model="pressanykey"
      max-width="300"
      persistent
    >
      <v-card>
        <v-card-title class="headline">
          {{ $t('options.keybinds.newkeybind') }}
        </v-card-title>
        <v-card-text>{{ $t('options.keybinds.pressakey') }}</v-card-text>
        <v-card-text>{{ computedNewKeys }}</v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'KeyBindInput',
  props: ['value', 'label'],
  data() {
    return {
      currentKey: 0,
      pressanykey: false,
      newKeys: Array(this.value.length).fill({ code: '_', key: '_' }),
    }
  },
  computed: {
    computedNewKeys() {
      let string = '[ '
      for(let key of this.newKeys)
        string += key.key + ' '
      string += ']'
      return string
    },
  },
  methods: {
    startInput() {
      this.currentKey = 0
      this.newKeys = Array(this.value.length).fill({ code: '_', key: '_' })
      this.pressanykey = true
      addEventListener("keydown", this.processInput)
    },
    stopInput() {
      this.pressanykey = false
      removeEventListener("keydown", this.processInput)
    },
    processInput(event) {
      event.preventDefault()
      event.stopPropagation()
      this.newKeys[this.currentKey] = { key: this.getKey(event.key, event.code), code: event.code}
      this.newKeys = Array.from(this.newKeys)
      this.currentKey++

      if(this.currentKey == this.newKeys.length) {
        this.$emit('input', this.newKeys)
        this.stopInput()
      }
    },
    getKey(key, code) {
      if(key == 'Dead') {
        return code.toUpperCase()
      } else if(key == ' ') {
        return 'Space'.toUpperCase()
      } else {
        return key.toUpperCase()
      }
    }
  }
}
</script>