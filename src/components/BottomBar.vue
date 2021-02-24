<template>
  <footer class="footer">
    <div class="content has-text-centered">
      <p>
        Current mania key mode: <strong>{{ $store.state.keys.length | integer }}K</strong>
      </p>
      <p>Keybinds: 
        <strong v-for="(key) in $store.state.keys" :key="key">{{ key | space}} </strong>
      </p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'BottomBar'
}
</script>