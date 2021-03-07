<template>
  <div>
    <Header/>
    <v-main>
      <v-row>
        <v-col cols="3">
          <GameField/>
        </v-col>
        <v-col cols="6">
          <router-view/>
        </v-col>
        <v-col cols="3">
          <Stats/>
        </v-col>
      </v-row>
    </v-main>
    <Footer/>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Header from './Header';
import GameField from './GameField';
import Stats from './Stats';
import Footer from './Footer';

export default {
  name: 'Game',
  components: {
    Header,
    GameField,
    Stats,
    Footer,
  },
  data() {
    return {
      gameInterval: null,
      saveInterval: null,
      gameDuration: 100,
      saveDuration: 5000
    }
  },
  created () {
    addEventListener("beforeunload", this.processSave)

    this.interval = setInterval(this.processFrame, this.gameDuration)
    this.saveInterval = setInterval(this.processSave, this.saveDuration)
  },
  methods: {
    ...mapActions([
      'processTimeFrame',
      'saveGame',
    ]),
    processSave() {
      this.saveGame()
    },
    processFrame() {
      this.processTimeFrame({ value: this.gameDuration })
    },
  },
  destroyed () {
    clearInterval(this.gameInterval)
    clearInterval(this.saveInterval)
  }
}
</script>