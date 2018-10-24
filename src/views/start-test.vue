<template>
  <div>
    <router-link to="/quill-editor-test">Test Vue-Quill-Editor</router-link>
    <br>
    <router-link to="/input-dialog-test">Test Vue-Input-Dialog</router-link>
    <hr style="margin:2em 0 2em 0">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'StartTest',
  data () {
    return {
      
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
