<template>
  <div>
    <Upload/>
    <Header showSkinDrawer="showSkinDrawer" @toggleShowSkinDrawer="showSkinDrawer = !showSkinDrawer"/>
    <v-main :style="mainStyle" id="main" v-resize="onResize">
      <v-row style="height: 100%" class="justify-center ma-0">
        <SkinDrawer v-if="showSkinDrawer"/>
        <GameCanvas/>
      </v-row>
    </v-main>
    <Footer/>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Upload from './Upload';
import Header from './Header';
import GameCanvas from './GameCanvas';
import Footer from './Footer';
import SkinDrawer from './SkinDrawer';

export default {
  name: 'Game',
  components: {
    Header,
    GameCanvas,
    Footer,
    Upload,
    SkinDrawer,
  },
  data() {
    return {
      showSkinDrawer: false,
      mainStyle: '',
    }
  },
  created () {
    addEventListener("beforeunload", this.processSave)
  },
  methods: {
    ...mapActions([
      'saveGame',
    ]),
    processSave() {
      this.saveGame()
    },
    onResize() {
      var height = window.innerHeight - document.getElementById('footer').offsetHeight
      this.mainStyle = 'height: ' + height + 'px'
    }
  },
}
</script>