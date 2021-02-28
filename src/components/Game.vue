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
import { mapActions, mapGetters } from 'vuex';
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
    addEventListener("keydown", this.processKeyDown)
    addEventListener("keyup", this.processKeyUp)
    addEventListener("beforeunload", this.processUnload)

    this.interval = setInterval(this.processTime, this.intervalDuration)
  },
  computed: mapGetters([
    'currentKeys',
    'keysPerTap',
    'keysPerSecond',
  ]),
  methods: {
    ...mapActions([
      'giveResource',
      'toggleShift',
      'saveGame',
    ]),
    hasKey(eventKey) {
      for(var keyConfig of this.currentKeys) {
        if(eventKey == keyConfig.keyBind) {
          return true;
        }
      }
      return false;
    },
    processUnload() {
      this.saveGame()
    },
    processKeyDown(event) {
      if(!event.repeat) {
        if (event.key == 'Shift') {
          this.toggleShift({ value: true })
        }
        if (this.hasKey(event.key)) {
          this.process(this.keysPerTap)
        }
      }
    },
    processKeyUp(event) {
      if (event.key == 'Shift') {
        this.toggleShift({ value: false })
      }
    },
    processTime() {
      this.process(this.intervalDuration * this.keysPerSecond)
    },
    process(totalkeys) {
      this.giveResource({id: 'experience', amount: totalkeys})
      this.giveResource({id: 'combo', amount: totalkeys})
    }
  },
  destroyed () {
    removeEventListener("keydown", this.myKeyPressListener);
    clearInterval(this.interval)
  }
}
</script>