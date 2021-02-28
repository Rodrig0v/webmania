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
    'toggleLoading',
  ]),
  created: function () {
    this.loadGame()
    if(this.$store.state.player == null) {
      var playerName = prompt('Please enter your username', 'Jadong');
      if(playerName == null) playerName = 'Jadong'
      this.resetGame({ name: playerName })
    }
    this.toggleLoading({ value: false })
  }

}
</script>