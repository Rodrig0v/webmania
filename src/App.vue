<template>
  <div>
    <NavBar/>
    <section class="main-content columns is-fullheight">
      <aside class="column is-3 is-narrow-mobile is-fullheight section is-hidden-mobile">
        <Stats/>
      </aside>
      <router-view/>
    </section>
    <BottomBar/>
  </div>
</template>

<script>
import NavBar from './components/NavBar';
import Stats from './components/Stats';
import BottomBar from './components/BottomBar';
import { mapActions } from 'vuex'

export default {
  name: 'App',
  components: {
    NavBar,
    Stats,
    BottomBar
  },
  data() {
    return {
      interval: null,
    }
    
  },
  created () {
    addEventListener("keydown", this.myKeyPressListener);
    this.interval = setInterval(this.myLoop, 100);
  },
  methods: {
    ...mapActions([
      'keyPressed',
      'timePassed'
    ]),
    myKeyPressListener(event) {
      if (!event.repeat &&
        this.$store.state.keys.includes(event.key)) {
        this.keyPressed()
      }
    },
    myLoop() {
      this.timePassed(0.100)
    },
  },
  destroyed () {
    clearInterval(this.interval)
  }
}
</script>