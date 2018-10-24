import Vue from 'vue'
import Router from 'vue-router'
import StartTest from '@/views/start-test'
import QuillEditorTest from '@/views/quill-editor-test'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'StartTest',
      component: StartTest,
      children: [
        { path: '/quill-editor-test', component: QuillEditorTest, name: 'Quill_Test',}
    ]
    }
  ]
})
