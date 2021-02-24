<template>
  <div>
    <p class="title">Stats</p>
    <h1>Combo {{ $store.state.combo | decimal }}</h1>
    <h1>Star rating {{ starRating | decimal }}</h1>
    <h1>Reading {{ $store.state.reading | integer }}</h1>
    <h1>Jacks {{ $store.state.jacks | integer }}</h1>
    <h1>Trilling {{ $store.state.trilling | integer }}</h1>
    <h1>Technique {{ $store.state.technique | integer }}</h1>
    <h1>KPS {{ keysPerSecond | decimal }}</h1>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Stats',
  computed: mapGetters([
    'starRating',
    'keysPerSecond'
  ]),
}
</script>