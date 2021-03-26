<template>
  <v-app>
    <Game v-if="!loading" class="fill-height"/>
    <Loading v-if="loading"/>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Game from './components/Game';
import Loading from './components/Loading';

export default {
  name: 'App',
  components: {
    Game,
    Loading
  },
  computed: mapGetters([
    'loading',
  ]),
  methods: mapActions([
    'loadGame',
    'resetGame',
    'changeLoading',
  ]),
  created: function () {
    this.loadGame()
    if(this.$store.state.configs == null) {
      let name = prompt('Please enter your username', 'Jadong');
      if(name == null) name = 'Jadong'
      this.resetGame({ value: name })
    }
    this.changeLoading({ value: false })
  }

}
</script>

<style>
html {
  overflow: hidden !important;
}
</style>