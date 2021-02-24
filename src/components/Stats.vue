<template>
  <v-list class="fill-height">
    <v-subheader>Skills</v-subheader>
    <v-list-item v-for="(skill) in $store.state.skills" :key="skill.id">
      <v-list-item-content>
        <v-list-item-title>{{ skill.statTag }} {{ skill.level | integer }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <div v-if="$store.state.keys.length == 7">
      <v-divider></v-divider>
      <v-subheader>Cheats</v-subheader>
      <v-list-item v-for="(cheat) in $store.state.cheats" :key="cheat.id">
        <v-list-item-content>
          <v-list-item-title>{{ cheat.statTag }} {{ cheat.level | integer }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </div>

  </v-list>
  <!--v-container>
    <h2>Skills</h2>
    <p>Reading {{ $store.state.reading | integer }}</p>
    <p>Jacks {{ $store.state.jacks | integer }}</p>
    <p>Trilling {{ $store.state.trilling | integer }}</p>
    <p>Technique {{ $store.state.technique | integer }}</p>
    <v-divider/>
    <h2>Upgrades</h2>
    <p>Bots {{ $store.state.bots | integer }}</p>
    <p>Macros {{ $store.state.macros | integer }}</p>
  </v-container-->
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