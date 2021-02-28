<template>
  <v-container fill-height class="flex-column justify-space-between black">
    <div>
      <h1 class="text-center">
        Playing <strong>{{ keyMode | integer }}K</strong>
      </h1>
      <p class="text-center"><v-icon>mdi-star</v-icon> {{ pp | decimal }}</p>
      <p class="text-center">{{ keysPerSecond * keysPerTap | integer }} keys per second</p>
    </div>
    <div>
      <h1 class="text-center">
        {{ combo | integer }}
      </h1>
      <p class="text-center">{{ $t('resources.combo') }}</p>
    </div>
    <div class="d-flex flex-row">
      <div v-for="(key) in currentKeys" :key="key.key" :style="'border: solid 1px black; padding: ' + key.padding + '; background: ' + key.background + '; color: ' + key.color">
        <strong>{{ key.key | space}}</strong>
      </div>
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'GameField',
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