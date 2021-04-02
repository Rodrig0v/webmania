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
      this.resetGame()
    }
    this.changeLoading({ value: false })
  }

}
</script>

<style>
html {
  overflow: hidden !important;
}
/* width */
::-webkit-scrollbar {
  width: 8px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #454545;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #242424;
  border-radius: 8px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #242424;
}
</style>