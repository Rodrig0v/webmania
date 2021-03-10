<template>
  <div>
    <v-card>

      <v-card-title>
        {{ $t('header.picksong') }}
      </v-card-title>

      <!--v-divider/-->

      <v-card-text>
        Test
      </v-card-text>

      <!--v-divider/-->

      <v-card-actions>
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
export default {
  name: 'PickSong',
}
</script>