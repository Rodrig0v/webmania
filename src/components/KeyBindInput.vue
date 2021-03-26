<template>
  <div class="d-flex flex-row">
    <v-text-field :id="showIndex ? 'keybind' + index : ''" :class="showIndex ? 'ma-4' : ''" :label="showIndex ? label + ' ' + (index + 1) : label" v-for="(keybind, index) of value" :key="index" :value="keybind.key" v-on:keydown="processInput(index, $event)"></v-text-field>
  </div>
</template>

<script>
export default {
  name: 'KeyBindInput',
  props: ['value', 'label', 'showIndex'],
  methods: {
    processInput(index, event) {
      let newValue = [...this.value]
      newValue[index] = { key: this.getKey(event.key, event.code), code: event.code}
      this.$emit('input', newValue)
      event.preventDefault()
      event.stopPropagation()
      if(this.showIndex && index < this.value.length - 1) {
        let next = document.getElementById('keybind' + (index + 1))
        next.focus()
      }
    },
    getKey(key, code) {
      if(key == 'Dead') {
        return code.toUpperCase()
      } else if(key == ' ') {
        return 'SPACE'
      } else {
        return key.toUpperCase()
      }
    }
  }
}
</script>