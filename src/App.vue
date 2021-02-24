<template>
  <v-app>
    <Header/>
    <v-main>
      <v-row class="fill-height">
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
  </v-app>
</template>

<script>
import Header from './components/Header';
import GameField from './components/GameField';
import Stats from './components/Stats';
import Footer from './components/Footer';

export default {
  name: 'App',
  components: {
    Header,
    GameField,
    Stats,
    Footer
  },
}
</script>