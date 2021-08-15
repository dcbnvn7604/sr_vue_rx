<template>
  <div data-testid="login">
    <form>
      <input data-testid="usernameInput" type="text" name="username" v-model="username" />
      <input data-testid="passwordInput" type="password" name="password" v-model="password" />
      <button data-testid="loginButton" type="button" v-stream:click="clickLogin">Log in</button>
    </form>
  </div>
</template>

<script>
  import { combineLatest } from 'rxjs';
  import { map, concatMap } from 'rxjs/operators';

  import api from '../api.js';

  export default {
    domStreams: ['clickLogin'],

    data() {
      return {
        username: '',
        password: ''
      }
    },

    mounted() {
      const username = this.$watchAsObservable('username')
        .pipe(map(x => x.newValue));
      const password = this.$watchAsObservable('password')
        .pipe(map(x => x.newValue));
      combineLatest(
        username,
        password,
        this.clickLogin
      ).pipe(concatMap(([username, password, _]) => {
        return api.login(username, password)
      })).subscribe(token => {
        localStorage.setItem('token', token);
        this.$router.push({path: '/'});
      });
    }
  }
</script>