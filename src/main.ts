import { createApp } from 'vue';
import App from './App.vue';
import { plugins } from './plugins';
import '@mdi/font/css/materialdesignicons.css';
import 'ress/dist/ress.min.css';

function main() {
    const mainApp = createApp(App);
    return plugins.reduce((app, plugin) => app.use(plugin), mainApp).mount('#app');
}

main();
