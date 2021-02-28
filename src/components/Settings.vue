<template>
  <div>
    <h1>{{ $t('settings.name') }}</h1>
    <v-text-field
      :label="$t('settings.name')"
      v-model="importExportText"
      hide-details="auto"
    ></v-text-field>
    <v-btn color="primary" @click="importPlayer">{{ $t('settings.import') }}</v-btn>
    <v-btn color="primary" @click="exportPlayer">{{ $t('settings.export') }}</v-btn>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import LZString from 'lz-string'

export default {
  name: 'Settings',
  data() {
    return {
      importExportText: null,
    }
  },
  methods: {
    ...mapActions([
      'importGame',
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
  }
}
</script>