<template>
  <v-app-bar id="header" v-on:newDifficulties="newDifficulties" app flat color="primary">
    <div class="d-flex align-center">
      
        <v-img
          class="shrink mr-2"
          contain
          :src="getLogo"
          transition="scale-transition"
          width="48"
        />

        <v-toolbar-title>Web!Mania</v-toolbar-title>
      </div>

      <div style="width: 15px"></div>

      <v-btn @click="$emit('toggleShowSkinDrawer')">
        <v-icon left>mdi-palette</v-icon>
        <span class="mr-2">{{ $t('header.skin') }}</span>
      </v-btn>

      <div style="width: 15px"></div>

      <v-dialog
        v-model="optionsDialog"
        max-width="700"
        @input="blur()"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on">
            <v-icon left>mdi-cog</v-icon>
            <span class="mr-2">{{ $t('header.options') }}</span>
          </v-btn>
        </template>

        <Options v-on:close="optionsDialog = false; blur()"/>
      </v-dialog>

      

      <v-spacer></v-spacer>

      <v-dialog
        v-model="pickPatternDialog"
        max-width="700"
        @input="blur()"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on">
            <v-icon left>mdi-gamepad</v-icon>
            <span class="mr-2">{{ $t('header.pickpattern') }}</span>
          </v-btn>
        </template>

        <PickPattern v-on:close="pickPatternDialog = false; blur()"/>
      </v-dialog>

      <div style="width: 15px"></div>

      <v-dialog
        v-model="pickSongDialog"
        max-width="700"
        @input="blur()"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on">
            <v-icon left>mdi-music</v-icon>
            <span class="mr-2">{{ $t('header.picksong') }}</span>
          </v-btn>
        </template>

        <PickSong :difficulties="difficulties" v-on:close="pickSongDialog = false; blur()"/>
      </v-dialog>

      <div style="width: 15px"></div>

      <v-btn @click="makeFullscreen">
        <v-icon left>mdi-fullscreen</v-icon>
        <span class="mr-2">{{ $t('header.fullscreen') }}</span>
      </v-btn>
  </v-app-bar>
</template>

<script>
import { mapActions } from 'vuex'
import Options from './Options';
import PickPattern from './PickPattern';
import PickSong from './PickSong';

export default {
  name: 'Header',
  components: {
    Options,
    PickPattern,
    PickSong
  },
  data() {
    return {
      difficulties: [],
      optionsDialog: false,
      pickPatternDialog: false,
      pickSongDialog: false,
    }
  },
  props: ['showSkinDrawer'],
  computed: {
    getLogo() {
      return this.$vuetify.theme.dark ? require('@/assets/app/logo-dark.png') : require('@/assets/app/logo-light.png')
    }
  },
  methods: {
    ...mapActions([
      'saveGame',
    ]),
    makeFullscreen() {
      let canvas = document.getElementById('gameCanvas')
      if(canvas) { 
        let makeFullscreenEvent = new CustomEvent('makeFullscreen')
        canvas.dispatchEvent(makeFullscreenEvent)
      }
    },
    blur() {
      setTimeout(() => { document.activeElement.blur() }, 0)
    },
    newDifficulties(event) {
      this.difficulties = event.detail
      this.pickSongDialog = true
    }
  }
}
</script>