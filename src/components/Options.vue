<template>
  <div>
    <v-card>

      <v-card-title>
        <v-tabs v-model="tab" grow>
          <v-tab>
            {{ $t('header.general') }}
          </v-tab>
          <v-tab>
            {{ $t('header.keybinds') }}
          </v-tab>
        </v-tabs>
      </v-card-title>

      <!--v-divider/-->

      <v-card-text>
        <v-tabs-items v-model="tab">
          <v-tab-item :key="0">
            <OptionsGeneral/>
          </v-tab-item>
          <v-tab-item :key="1">
            <OptionsKeyBinds/>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>

      <!--v-divider/-->

      <v-card-actions >
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          text
          @click="$emit('close')"
        >
          {{ $t('general.apply') }}
        </v-btn>
      </v-card-actions>

    </v-card>
  </div>
</template>

<script>
import OptionsGeneral from './OptionsGeneral';
import OptionsKeyBinds from './OptionsKeyBinds';

export default {
  name: 'Options',
  components: {
    OptionsGeneral,
    OptionsKeyBinds,
  },
  data() {
    return {
      tab: null,
    }
  },
  methods: {
    dialog() {

    }
  }
}
</script>