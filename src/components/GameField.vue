<template>
  <v-container fill-height class="flex-column justify-space-between black" style="width: 450px; height: 800px; padding: 0">
    <GameCanvas/>
  </v-container>
</template>

<script>
import GameCanvas from './GameCanvas';

export default {
  name: 'GameField',
  components: {
    GameCanvas,
  },
}
</script>
