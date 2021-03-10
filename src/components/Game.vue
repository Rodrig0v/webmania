<template>
  <div>
    <Header/>
    <GameCanvas/>
    <Footer/>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Header from './Header';
import GameCanvas from './GameCanvas';
import Footer from './Footer';

export default {
  name: 'Game',
  components: {
    Header,
    GameCanvas,
    Footer,
  },
  data() {
    return {
      //gameInterval: null,
      saveInterval: null,
      //gameDuration: 100,
      saveDuration: 5000
    }
  },
  created () {
    addEventListener("beforeunload", this.processSave)

    //this.interval = setInterval(this.processFrame, this.gameDuration)
    this.saveInterval = setInterval(this.processSave, this.saveDuration)
  },
  methods: {
    ...mapActions([
      //'processTimeFrame',
      'saveGame',
    ]),
    processSave() {
      this.saveGame()
    },
    /*processFrame() {
      this.processTimeFrame({ value: this.gameDuration })
    },*/
  },
  destroyed () {
    //clearInterval(this.gameInterval)
    clearInterval(this.saveInterval)
  }
}
</script>