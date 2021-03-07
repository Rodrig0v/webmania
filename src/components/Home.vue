<template>
  <v-container>
    <v-col><h1>Home</h1></v-col>
    <v-col><h2>Skills</h2></v-col>
    <v-col style="margin-bottom: 16px">
      <v-row align="center" justify="space-around">
        <v-tooltip bottom v-for="(skill) in info.skills" :key="skill.id">
          <template v-slot:activator="{ on }">
            <div v-on="on">
              <v-btn color="primary" :disabled="experience < skill.costFunction(skills[skill.id])" @click="buySkill({id: skill.id, value: 1})">
                <span class="mr-2">{{ $t(`skills.${skill.id}.buy`) }}</span>
              </v-btn>
            </div>
          </template>
          <span>{{ $t('tooltip.cost') }}: {{ skill.costFunction(skills[skill.id]) }} {{ $t('resources.experience') }}</span>
        </v-tooltip>
      </v-row>
    </v-col>
    <div>
      <v-divider/>
      <v-col><h2>Cheats</h2></v-col>
      <v-col style="margin-bottom: 16px">
        <v-row align="center" justify="space-around">
          <v-tooltip bottom v-for="(cheat) in info.cheats" :key="cheat.id">
            <template v-slot:activator="{ on }">
              <div v-on="on">
                <v-btn color="primary" :disabled="clout < cheat.costFunction(cheats[cheat.id])" @click="buyCheat({id: cheat.id, value: 1})">
                  <span class="mr-2">{{ $t(`cheats.${cheat.id}.buy`) }}</span>
                </v-btn>
                </div>
            </template>
            <span>{{ $t('tooltip.cost') }}: {{ cheat.costFunction(cheats[cheat.id]) }} {{ $t('resources.clout') }}</span>
          </v-tooltip>
        </v-row>
      </v-col>
      <v-divider/>
    </div>
    <v-divider/>
    <v-col><h2>Transcend</h2></v-col>
    <v-col style="margin-bottom: 16px">
      <v-row align="center" justify="space-around">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <div v-on="on">
              <v-btn color="primary" :disabled="$store.getters.starRating < 10" @click="buyKey()">
                <span class="mr-2">Use another key</span>
              </v-btn>
            </div>
          </template>
          <span>Requirement: 10 star rating</span>
        </v-tooltip>
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import info from '../models/info'

export default {
  name: 'Home',
  data() {
    return {
      info: info
    }
  },
  computed: mapGetters([
    'experience',
    'money',
    'clout',
    'skills',
    'cheats',
    'pp',
  ]),
  methods: mapActions([
    'buySkill',
    'buyCheat',
  ]),
}
</script>