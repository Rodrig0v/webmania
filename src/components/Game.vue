<template>
  <div>
    <Upload/>
    <Header/>
    <GameCanvas/>
    <Footer/>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Upload from './Upload';
import Header from './Header';
import GameCanvas from './GameCanvas';
import Footer from './Footer';

export default {
  name: 'Game',
  components: {
    Header,
    GameCanvas,
    Footer,
    Upload,
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
  },
}
</script>