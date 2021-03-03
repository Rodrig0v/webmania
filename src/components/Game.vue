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
      interval: null,
      intervalDuration: 100
    }
  },
  created () {
    addEventListener("beforeunload", this.processUnload)

    this.interval = setInterval(this.newTimeFrame, this.intervalDuration)
  },
  methods: {
    ...mapActions([
      'processTimeFrame',
      'saveGame',
    ]),
    processUnload() {
      this.saveGame()
    },
    newTimeFrame() {
      this.processTimeFrame({ time: this.intervalDuration })
    },
  },
  destroyed () {
    clearInterval(this.interval)
  }
}
</script>