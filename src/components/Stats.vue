<template>
  <v-list class="fill-height">
    <v-subheader>{{ $t('skills.name') }}</v-subheader>
    <v-list-item v-for="(skill) in info.skills" :key="skill.id">
      <v-list-item-content>
        <v-list-item-title>{{ $t(`skills.${skill.id}.name`) }} {{ skills[skill.id] | integer }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <div>
      <v-divider></v-divider>
      <v-subheader>{{ $t('cheats.name') }}</v-subheader>
      <v-list-item v-for="(cheat) in info.cheats" :key="cheat.id">
        <v-list-item-content>
          <v-list-item-title>{{ $t(`cheats.${cheat.id}.name`) }} {{ cheats[cheat.id] | integer }}</v-list-item-title>
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
import info from '../models/info'

export default {
  name: 'Stats',
  data() {
    return {
      info: info
    }
  },
  computed: mapGetters([
    'pp',
    'cheats',
    'skills',
    'keysPerSecond'
  ]),
}
</script>