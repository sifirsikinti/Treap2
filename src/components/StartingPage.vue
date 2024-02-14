<template>
  <div class="wrapper">
    <div class="navBar">
      <h1>Treap - it's Cheap!</h1>
      <div class="underline"></div>
    </div>

    <div class="routePlanner">
      <h1>Dein Reiseplaner</h1>
      
      <!-- Startort InputGroup -->
      <div class="inputGroup">
        <div class="inputWithIcon">
          <span class="icon">&#9992;</span> <!-- Flugzeug Icon -->
          <input v-model="cityName" @input="searchCities" type="text" placeholder="Startort" />
        </div>
        <div class="dropdownContainer" v-if="cities.length">
          <div class="dropdown">
            <div v-for="city in cities" :key="city.id" @click="selectCity(city)" class="dropdown-item">
              {{ city.name }}
            </div>
          </div>
        </div>
      </div>

      <!-- Zielort InputGroup -->
      <div class="inputGroup">
        <div class="inputWithIcon">
          <span class="icon">&#9992;</span> <!-- Flugzeug Icon -->
          <input v-model="destinationName" @input="searchDestinations" type="text" placeholder="Zielort" />
        </div>
        <div class="dropdownContainer" v-if="destinations.length">
          <div class="dropdown">
            <div v-for="destination in destinations" :key="destination.id" @click="selectDestination(destination)" class="dropdown-item">
              {{ destination.name }}
            </div>
          </div>
        </div>
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
    destinationName: '', // Neuer v-model Wert für das Zielland
    destinations: [], // Liste der Vorschläge für das Zielland
  };
},
methods: {
  async searchCities() {
    if (this.cityName.length < 3) {
      this.cities = []; // Leere die Liste, wenn weniger als 3 Buchstaben eingegeben wurden
      return; // Beende die Methode vorzeitig
    }

    try {
      const response = await axios.get(`http://localhost:3000/search-cities?keyword=${this.cityName}`);
      this.cities = response.data.data; // Aktualisiere die Liste mit den neuen Vorschlägen
    } catch (error) {
      console.error('Fehler beim Abrufen der Städte:', error);
      this.cities = []; // Leere die Liste im Fehlerfall
    }
  },
  async searchDestinations() {
    if (this.destinationName.length < 3) {
      this.destinations = []; // Leere die Liste, wenn weniger als 3 Buchstaben eingegeben wurden
      return; // Beende die Methode vorzeitig
    }

    try {
      const response = await axios.get(`http://localhost:3000/search-cities?keyword=${this.destinationName}`);
      this.destinations = response.data.data; // Aktualisiere die Liste mit den neuen Vorschlägen
    } catch (error) {
      console.error('Fehler beim Abrufen der Ziele:', error);
      this.destinations = []; // Leere die Liste im Fehlerfall
    }
  },
  selectCity(city) {
    this.cityName = city.name; // Aktualisiere den Namen der ausgewählten Stadt
    this.cities = []; // Leere die Liste der Vorschläge
  },
  selectDestination(destination) {
    this.destinationName = destination.name; // Aktualisiere den Namen der ausgewählten Stadt
    this.destinations = []; // Leere die Liste der Vorschläge
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
  flex-direction: column;
  align-items: center; /* Zentriert die Elemente vertikal */
  width: 100%;
  position: relative;
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

.dropdown {
  width: 100%; /* Setze die Breite des Dropdowns auf die des Containers */
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.dropdown-item {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background-color: #f9f9f9;
}

/* Anpassung für das inputGroup-Div, um die absolute Positionierung der Dropdowns zu unterstützen */
.inputGroup {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
}

/* Anpassungen für das routePlanner-Div, um Platz für das Dropdown zu schaffen */
.routePlanner {
  padding-bottom: 80px; /* Erhöhe den unteren Abstand, um Platz für das Dropdown zu schaffen */
}

.inputWithIcon {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
}

.dropdownContainer {
  width: calc(100% - 40px); /* Ziehe den Platz für das Icon ab */
  max-width: 220px; /* Die maximale Breite des Dropdown-Menus */
  position: absolute;
  top: 35px; /* Die Höhe des Input-Feldes + ein kleiner Abstand */
  left: 50%;
  transform: translateX(-50%); /* Zentriert den Container horizontal */
  z-index: 5;
}
</style>