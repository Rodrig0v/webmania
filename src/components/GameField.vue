<template>
  <v-container fill-height class="flex-column justify-space-between black">
    <div>
      <h1 class="text-center">
        Playing <strong>{{ $store.state.keys.length | integer }}K</strong>
      </h1>
      <p class="text-center"><v-icon>mdi-star</v-icon> {{ starRating | decimal }}</p>
      <p class="text-center">{{ keysPerSecond * comboPerKey | integer }} keys per second</p>
    </div>
    <div>
      <h1 class="text-center">
        {{ $store.state.combo | integer }}
      </h1>
      <p class="text-center">combo</p>
    </div>
    <div class="d-flex flex-row">
      <div v-for="(key) in $store.state.keys" :key="key.key" :style="'border: solid 1px black; padding: ' + key.padding + '; background: ' + key.background + '; color: ' + key.color">
        <strong>{{ key.key | space}}</strong>
      </div>
    </div>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'

export default {
  name: 'GameField',
  data() {
    return {
      interval: null,
    }
    
  },
  created () {
    addEventListener("keydown", this.myKeyPressListener);
    this.interval = setInterval(this.myLoop, 100);
  },
  computed: mapGetters([
    'comboPerKey',
    'starRating',
    'keysPerSecond'
  ]),
  methods: {
    ...mapActions([
      'keyPressed',
      'timePassed'
    ]),
    hasKey(eventKey) {
      for(var key of this.$store.state.keys) {
        if(eventKey == key.key) {
          return true;
        }
      }
      return false;
    },
    myKeyPressListener(event) {
      if (!event.repeat &&
        this.hasKey(event.key)) {
        this.keyPressed()
      }
    },
    myLoop() {
      this.timePassed(0.100)
    },
  },
  destroyed () {
    removeEventListener("keydown", this.myKeyPressListener);
    clearInterval(this.interval)
  }
}
</script>