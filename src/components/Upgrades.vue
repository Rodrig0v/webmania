<template>
  <div>
    <p class="title">Upgrades</p>
    <div class="buttons">
      <a class="button is-primary" v-on:click="buyReading">Practice Reading</a>
      <a class="button is-primary" @click="buyJacks">Practice Jacks</a>
      <a class="button is-primary" @click="buyTrilling">Practice Trilling</a>
      <a class="button is-primary" @click="buyTechnique">Practice Technique</a>
    </div>
    <div class="buttons">
      <a class="button is-primary" @click="buyBot">Build a bot</a>
      <a class="button is-primary" @click="buyNewKey">Upgrade to {{ $store.state.keys.length + 1 }}K</a>
      <!-- label="Cost: 100 keytaps" position="is-bottom">
      <b-button type="is-primary" @click="buyBot">Use a robot</b-button>
      </b-tooltip>
      <b-tooltip label="Requirement: 10 star rating" position="is-bottom">
      <b-button type="is-primary" @click="buyNewKey">Use a new key</b-button>
      </b-tooltip-->
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Upgrades',
  methods: mapActions([
    'buyReading',
    'buyJacks',
    'buyTrilling',
    'buyTechnique',
    'buyBot',
    'buyNewKey',
  ]),
}
</script>