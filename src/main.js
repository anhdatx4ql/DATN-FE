import { createApp } from 'vue'
import App from '@/App.vue'
import { createPinia } from 'pinia'
import {router} from './router.js'
import vueColumnsResizable from './plugins/vue-columns-resizable/plugins/vue-columns-resizable/index.js'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const pinia = createPinia();

const app = createApp(App);

app.use(vueColumnsResizable);
app.use(pinia);
app.use(router);
app.use(ElementPlus);
router.isReady().then(()=> {
    app.mount("#app")
})