<template>
  <v-container fill-height class="flex-column justify-space-between black" style="width: 450px; height: 800px; padding: 0">
    <GameCanvas/>
    <div>
      <h1 class="text-center">
        Playing <strong>{{ keyMode | integer }}K</strong>
      </h1>
      <p class="text-center"><v-icon>mdi-star</v-icon> {{ pp | decimal }}</p>
      <p class="text-center">{{ keysPerSecond * keysPerTap | integer }} keys per second</p>
    </div>
    <div v-if="combo > 0">
      <h1 class="text-center">
        {{ combo | integer }}
      </h1>
      <p class="text-center">{{ $t('resources.combo') }}</p>
    </div>
    <div></div>
    <div></div>
    <div></div>
    <div class="d-flex flex-row justify-space-around" style="width: 100%; margin-bottom: 15px;">
      <div v-for="(key) in currentKeys" :key="key.key" class="keybind">
        <strong>{{ key.keyBind | space}}</strong>
      </div>
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import GameCanvas from './GameCanvas';


export default {
  name: 'GameField',
  components: {
    GameCanvas,
  },
  computed: mapGetters([
    'currentKeys',
    'keysPerTap',
    'keysPerSecond',
    'combo',
    'keyMode',
    'pp'
  ]),
}
</script>

<style>
div {
  z-index: 1;
}
.keybind {
    color: white;
    flex: 1 1 0;
    text-align: center;
}
</style>