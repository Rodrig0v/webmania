<template>
  <v-container>
    <v-col><h1>Home</h1></v-col>
    <v-col><h2>Skills</h2></v-col>
    <v-col style="margin-bottom: 16px">
      <v-row align="center" justify="space-around">
        <v-tooltip bottom v-for="(skill) in $store.state.skills" :key="skill.id">
          <template v-slot:activator="{ on }">
            <div v-on="on">
              <v-btn color="primary" :disabled="$store.state.combo < skill.cost" @click="buyPractice({id: skill.id, amount: 1})">
                <span class="mr-2">{{ skill.buyTag }}</span>
              </v-btn>
            </div>
          </template>
          <span>Cost: {{ skill.cost }} combo</span>
        </v-tooltip>
      </v-row>
    </v-col>
    <div v-if="$store.state.keys.length == 7">
      <v-divider/>
      <v-col><h2>Cheats</h2></v-col>
      <v-col style="margin-bottom: 16px">
        <v-row align="center" justify="space-around">
          <v-tooltip bottom v-for="(cheat) in $store.state.cheats" :key="cheat.id">
            <template v-slot:activator="{ on }">
              <div v-on="on">
                <v-btn color="primary" :disabled="$store.state.combo < cheat.cost" @click="buyCheat({id: cheat.id, amount: 1})">
                  <span class="mr-2">{{ cheat.buyTag }}</span>
                </v-btn>
                </div>
            </template>
            <span>Cost: {{ cheat.cost }} combo</span>
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
import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  computed: mapGetters([
    'starRating',
  ]),
  methods: mapActions([
    'buyKey',
    'buyPractice',
    'buyCheat',
  ]),
}
</script>