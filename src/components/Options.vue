<template>
  <div>
    <v-card>

      <v-card-title>
        <v-tabs v-model="tab" grow>
          <v-tab>
            {{ $t('header.gameplay') }}
          </v-tab>
          <v-tab>
            {{ $t('header.skin') }}
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
            <OptionsGameplay/>
          </v-tab-item>
          <v-tab-item :key="1">
            <OptionsSkin/>
          </v-tab-item>
          <v-tab-item :key="2">
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
import OptionsGameplay from './OptionsGameplay';
import OptionsKeyBinds from './OptionsKeyBinds';
import OptionsSkin from './OptionsSkin';

export default {
  name: 'Options',
  components: {
    OptionsGameplay,
    OptionsKeyBinds,
    OptionsSkin
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