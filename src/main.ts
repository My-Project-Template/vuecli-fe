import { createApp } from 'vue';
import App from './App.vue';
import { plugins } from './plugins';
import '@/assets/styles/scss/global-conf.scss';

function main() {
    const mainApp = createApp(App);
    return plugins.reduce((app, plugin) => app.use(plugin), mainApp).mount('#app');
}

main();
