<template>
  <div class="wrapper">
    <div class="navBar">
      <h1>Treap - it's Cheap!</h1>
      <div class="underline"></div>
    </div>

    <div class="routePlanner">
      <h1>Dein Reiseplaner</h1>
      <div class="inputGroup">
        <span class="icon">&#9992;</span> <!-- Flugzeug Icon -->
        <input v-model="cityName" @input="searchCities" type="text" placeholder="Startort" />
        <ul v-if="cities.length">
          <li v-for="city in cities" :key="city.id">{{ city.name }}</li>
        </ul>
        <span class="icon">&#9992;</span> <!-- Flugzeug Icon -->
        <input type="text" placeholder="Zielort" />
      </div>
      <button class="plan">
        <span class="buttonIcon">&#128269;</span> Suchen
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "StartingPage",
  data() {
    return {
      cityName: '',
      cities: [],
    };
  },
  methods: {
    async searchCities() {
      if (this.cityName.length < 3) return; // Vermeide unnötige Anfragen bei zu kurzer Eingabe

      try {
        const response = await axios.get(`http://localhost:3000/search-cities?keyword=${this.cityName}`);
        this.cities = response.data.data; // Passt die Zuweisung an die Struktur der API-Antwort an
      } catch (error) {
        console.error('Fehler beim Abrufen der Städte:', error);
        this.cities = [];
      }
    },
  },
  mounted() {
    // Beispiel für das Setzen eines Hintergrundbildes, angepasst an deine Projektstruktur
    document.documentElement.style.setProperty('--background-image-url', `url(${require('@/assets/background2.png')})`);
  },
};
</script>
<style>
html, body {
  margin: 0;
  padding: 0;
  overflow: hidden; /* Verhindert das Scrollen auf der Seite */
  height: 100%; /* Stellt sicher, dass html und body den gesamten Bildschirm ausfüllen */
  width: 100%; /* Stellt sicher, dass html und body den gesamten Bildschirm ausfüllen */
}

.wrapper {
  position: absolute; /* Geändert zu absolute für eine präzisere Positionierung */
  top: 0;
  left: 0;
  height: 100vh; /* Nutzt 100% der Viewport-Höhe */
  width: 100vw; /* Nutzt 100% der Viewport-Breite */
  background-image: var(--background-image-url);
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.navBar {
  font-family: Rockwell;
  font-weight: bold;
  color: black; /* Schriftfarbe zu Schwarz geändert für besseren Kontrast */
  font-size: 25px;
  width: 100%;
  text-align: center;
  padding: 20px 0;
  background-color: rgba(255, 255, 255, 0.8); /* Leicht durchsichtiges Weiß */
  position: sticky;
  top: 0;
  z-index: 3;
}

.underline {
  height: 2px;
  background-color: currentColor;
  box-shadow: 0 2px 5px rgba(0,0,0,0.5);
  margin-top: 10px;
}

.routePlanner {
  background-color: rgba(255, 255, 255, 0.8); /* Leicht durchsichtiges Weiß */
  border-radius: 30px;
  color: black; /* Schriftfarbe zu Schwarz geändert für besseren Kontrast */
  padding: 60px; /* Padding vergrößert für mehr Höhe */
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  margin-top: 20px;
  width: 80%;
  max-width: 800px;
  gap: 20px; /* Abstand zwischen den Elementen vergrößert */
}

.inputGroup {
  display: flex;
  align-items: center;
  gap: 10px;
}

.routePlanner input {
  width: 220px;
  height: 30px;
  border-radius: 10px;
  border: none;
  background-color: white; /* Hintergrund zu reinem Weiß für bessere Sichtbarkeit */
  color: black; /* Schriftfarbe zu Schwarz geändert für besseren Kontrast */
}

.plan {
  width: 250px;
  margin-top: 20px;
  height: 40px;
  background-color: white; /* Hintergrund zu reinem Weiß für bessere Sichtbarkeit */
  color: black; /* Textfarbe des Buttons zu Schwarz geändert für besseren Kontrast */
  border: none;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.plan:hover {
  background-color: #cccccc; /* Dunklerer Ton für den Hover-Zustand */
}

.icon, .buttonIcon {
  margin-right: 10px;
}
</style>