// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)

// Register components
import vueQuillEditor from "./components/vue-quill-editor";
Vue.component("quill-editor",vueQuillEditor);
import inputDialog from "./components/vue-input-dialog";
Vue.component("input-dialog",inputDialog);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
