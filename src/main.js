import { createApp } from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router'; // Stelle sicher, dass der Pfad korrekt ist
import { loadFonts } from './plugins/webfontloader';

loadFonts();

createApp(App)
  .use(vuetify)
  .use(router) // Füge den Router zur App hinzu
  .mount('#app');
