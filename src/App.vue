<template>
  <div>
    <h1>Current number of keys: {{ keys.length }}</h1>
    <h2 v-for="(key, index) in keys" :key="key">{{ index + 1 }}: {{ key }}</h2>
    <h1>Total keys tapped: {{ totalKeysTapped }}</h1>
    <h1>Available keytaps: {{ keyTaps }}</h1>
    <h1>Current star rating: {{ starRating }}</h1>
    <h1>Reading: {{ reading }}</h1>
    <button @click="buyReading">Practice ({{ 50 }} keytaps)</button>
    <h1>Jacks: {{ jacks }}</h1>
    <button @click="buyJacks">Practice ({{ 50 }} keytaps)</button>
    <h1>Trilling: {{ trilling }}</h1>
    <button @click="buyTrilling">Practice ({{ 50 }} keytaps)</button>
    <h1>Technique: {{ technique }}</h1>
    <button @click="buyTechnique">Practice ({{ 50 }} keytaps)</button>
    <h1>Current keys per second: {{ keysPerSecond }}</h1>
    <button @click="buyBot">Buy a bot ({{ 100 }} keytaps)</button>
    <button @click="buyNewKey">Use a new key ({{ 10 }} star rating)</button>
  </div>
</template>

<script>
export default {
  name: 'App',
  data: function () {
    return {
      totalKeysTapped: null,
      keysTaps: null,
      keys: null,
      reading: null,
      jacks: null,
      trilling: null,
      technique: null,
      bots: null,
    };
  },
  created () {
    this.totalKeysTapped = 0;
    this.keyTaps = 0;
    this.keys = ["j"];
    this.reading = 0,
    this.jacks = 0,
    this.trilling = 0,
    this.technique = 0
    addEventListener("keypress", this.myKeyPressListener);
    setInterval(this.myLoop, 10);
  },
  computed: {
    keysPerSecond() {
      return this.bots * 0.1;
    },
    starRating() {
      return (this.reading + this.jacks + this.trilling + this.technique) / 4;
    },
  },
  methods: {
    myKeyPressListener(event) {
      if (this.keys.includes(event.key)) {
          this.keyTaps++;
          this.totalKeysTapped++;
      }
    },
    myLoop() {
      this.keyTaps += this.keysPerSecond * 0.010;
    },
    buyReading() {
      if(this.keyTaps >= 50 ) {
        this.reading++;
        this.keyTaps-= 50;
      }
    },
    buyJacks() {
      if(this.keyTaps >= 50 ) {
        this.jacks++;
        this.keyTaps-= 50;
      }
    },
    buyTrilling() {
      if(this.keyTaps >= 50 ) {
        this.trilling++;
        this.keyTaps-= 50;
      }
    },
    buyTechnique() {
      if(this.keyTaps >= 50 ) {
        this.technique++;
        this.keyTaps-= 50;
      }
    },
    buyBot() {
      if(this.keyTaps >= 100 ) {
        this.bots++;
        this.keyTaps-= 100;
      }
    },
    buyNewKey() {
      if(this.keys.length <= 7 && this.starRating >= 10 ) {
        switch(this.keys.length) {
          case 1:
          this.keys = ["f", "j"];
          break;
          case 2:
          this.keys = ["f", " ", "j"];
          break;
          case 3:
          this.keys = ["d", "f", "j", "k"];
          break;
          case 4:
          this.keys = ["d","f", " ", "j", "k"];
          break;
          case 5:
          this.keys = ["s", "d", "f", "j", "k", "l"];
          break;
          case 6:
          this.keys = ["s", "d", "f", " ", "j", "k", "l"];
          break;
        }
      }
    },
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
