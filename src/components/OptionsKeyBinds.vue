<template>
  <div>
    <v-tabs v-model="tab" grow>
      <v-tab v-for="(keyMode) in Object.keys(allKeys)" :key="keyMode">
        {{ keyMode }} K
      </v-tab>
    </v-tabs>

    <div style="width: 100%; display: flex; justify-content: center">
      <v-btn color="primary" v-for="(key, index) in allKeys[tab+1]" :key="index" @click="keyBind(index)" style="margin: 8px;">{{ key.key | space }}</v-btn>
    </div>

    <v-dialog
      v-model="keybindDialog"
      persistent
    >
      <v-card>
        <v-card-title class="headline">
          {{ $t('options.keybinds.changekeybind') }}
        </v-card-title>
        <v-card-text>
          {{ $t('options.keybinds.presskey') }}
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'OptionsKeyBinds',
  data() {
    return {
      tab: null,
      keybindDialog: false,
      keyBeingChanged: null,
    };
  },
  computed: {
    ...mapGetters([
      'allKeys',
    ]),
  },
  methods: {
    ...mapActions([
    'changeKeyBind',
  ]),
  keyBind(keyId) {
      this.keyBeingChanged = keyId
      this.keybindDialog = true
      addEventListener("keydown", this.newKeyBind)
    },
    newKeyBind(event) {
      removeEventListener("keydown", this.newKeyBind)
      this.changeKeyBind({ mode: this.tab + 1, id: this.keyBeingChanged, key: event.key == 'Dead' ? event.code : event.key, code: event.code})
      this.keybindDialog = false
      this.keyBeingChanged = null
    }
},

}
</script>