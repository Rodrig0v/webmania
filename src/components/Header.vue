<template>
  <v-app-bar app flat color="primary">
    <div class="d-flex align-center">
      
        <v-img
          class="shrink mr-2"
          contain
          :src="getLogo"
          transition="scale-transition"
          width="40"
        />

        <v-toolbar-title>Osu!Mania Idle</v-toolbar-title>

        <div style="width: 32px">
        </div>

        <router-link to="/">
          <v-btn text>
            <v-icon>mdi-home</v-icon>
            <span class="mr-2">Home</span>
          </v-btn>
        </router-link>

        <router-link to="/achievements">
          <v-btn text>
            <v-icon>mdi-medal</v-icon>
            <span class="mr-2">Achievements</span>
          </v-btn>
        </router-link>
      </div>

      <v-spacer></v-spacer>

      <router-link to="/settings">
        <v-btn text>
          <v-icon>mdi-cog</v-icon>
          <span class="mr-2">Settings</span>
        </v-btn>
      </router-link>

      <v-btn @click="saveGame">
        <v-icon>mdi-content-save</v-icon>
        <span class="mr-2">Save</span>
      </v-btn>
  </v-app-bar>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Header',
  computed: {
    getLogo() {
      return this.$vuetify.theme.dark ? require('@/assets/app/logo-dark.png') : require('@/assets/app/logo-light.png')
    }
  },
  methods: mapActions([
    'saveGame'
  ])
}
</script>