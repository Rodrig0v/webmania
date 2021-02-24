<template>
<nav class="navbar" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
		<a class="navbar-item">
			<img :src="getLogo" alt="Osu!Mania Idle">
		</a>
    <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>

  <div id="navbarBasicExample" class="navbar-menu">
    <div class="navbar-start">
      <router-link to="/">
				<a class="navbar-item">Upgrades</a>
			</router-link>

      <router-link to="/teste">
				<a class="navbar-item">Config</a>
			</router-link>
    </div>

    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <a class="button is-primary">
            <strong>Sign up</strong>
          </a>
          <a class="button is-light">
            Log in
          </a>
        </div>
      </div>
    </div>
  </div>
</nav>
</template>

<script>
export default {
  name: 'NavBar',
  computed: {
    getLogo() {
      return this.$vuetify.theme.dark ? require('../assets/logo-dark.png') : require('./../assets/logo-light.png')
    }
  }
}
</script>