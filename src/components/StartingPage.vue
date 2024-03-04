<template>
  <div class="wrapper">
    <div class="navBar">
      <h1>Treap - it's Cheap!</h1>
      <div class="underline"></div>
    </div>

    <div class="routePlanner">
      <h1>Dein Reiseplaner</h1>
      <div class="mainInputs">
        <div class="inputGroup">
          <div class="inputWithIcon">
            <span class="icon">&#9992;</span>
            <input
              v-model="cityName"
              @input="searchCities"
              type="text"
              placeholder="Startort*"
            />
          </div>
          <div class="dropdownContainer" v-if="cities.length">
            <div class="dropdown">
              <div
                v-for="city in cities"
                :key="city.id"
                @click="selectCity(city)"
                class="dropdown-item"
              >
                {{ city.name }}
              </div>
            </div>
          </div>
        </div>

        <div class="inputGroup">
          <div class="inputWithIcon">
            <span class="icon">&#9992;</span>
            <input
              v-model="destinationName"
              @input="searchDestinations"
              type="text"
              placeholder="Zielort*"
            />
          </div>
          <div class="dropdownContainer" v-if="destinations.length">
            <div class="dropdown">
              <div
                v-for="destination in destinations"
                :key="destination.id"
                @click="selectDestination(destination)"
                class="dropdown-item"
              >
                {{ destination.name }}
              </div>
            </div>
          </div>
        </div>

        <div class="inputGroup hinflug">
          <h4>Hinflugdatum:*</h4>
          <input
            class="Datum"
            v-model="departure"
            type="date"
            placeholder="Anfangsdatum"
          />
        </div>

        <div class="inputGroup erwachsene">
          <h4>Anzahl Erwachsene (älter 12 Jahre):*</h4>
          <input
            class="Datum"
            v-model="adults"
            type="number"
            placeholder="Anzahl Erwachsene"
          />
        </div>
      </div>
      <button class="filterIcon" @click="toggleAdvancedOptions">
        <span class="buttonIcon"> &#x2630;</span>Details
      </button>

      <div v-if="showAdvancedOptions">
        <div class="erwachsene">
        <h4 for="departureDate">Anzahl Kinder</h4>
        <input
          class="Datum"
          v-model="children"
          type="number"
          placeholder="Anzahl Kinder"
        />
        </div>
        <div class="erwachsene">
        <h4 for="departureDate">Anzahl Kinder jünger 2 Jahre</h4>
        <input
          class="Datum"
          v-model="infants"
          type="number"
          placeholder="Anzahl Kinder < 2 Jahre"
        />
</div>
<div class="erwachsene">
        <h4 for="departureDate">Rückflugdatum</h4>

        <input
          class="Datum"
          v-model="returnDate"
          type="date"
          placeholder="Rückflugdatum"
        />
        </div>

        <div class="inputGroup">
          <h4 for="departureDate" class="reiseklasse">Reiseklasse</h4>
          <div class="digga">
            <select v-model="travelClass">
              <option value="ECONOMY">Economy</option>
              <option value="PREMIUM_ECONOMY">Premium Economy</option>
              <option value="BUSINESS">Business</option>
              <option value="FIRST">First</option>
            </select>
          </div>
        </div>

        <div class="inputGroup checkboxGroup">
            <label for="nonStop" class="checkboxLabel"
              >Nur Non-Stop Flüge</label
            >
            <input
              class="checkbox"
              type="checkbox"
              id="nonStop"
              v-model="nonStop"
            />
          </div>

        <div class="inputGroup erwachsene">
          <input
            class="max"
            type="number"
            v-model.number="maxPrice"
            placeholder="Maximaler Preis"
          />
        </div>
      </div>
      <button class="plan" @click="searchFlightsAndHotels">
        <span class="buttonIcon">&#128269;</span> Suchen
      </button>

      <button class="plan" @click="toggleFilter">
        <font-awesome-icon icon="filter" class="buttonIcon"></font-awesome-icon
        >{{ filterType }}
      </button>
    </div>

    <div class="flight-container" v-if="filterType === 'Flüge'">
      <div v-for="(flight, index) in flights" :key="index" class="flight-info">
        <p class="flight-detail">
          <strong>Abflug:</strong>
          {{ formatDate(flight.itineraries[0].segments[0].departure.at) }}
        </p>
        <p class="flight-detail">
          <strong>Ankunft:</strong>
          {{ formatDate(flight.itineraries[0].segments[0].arrival.at) }}
        </p>
        <p class="flight-detail">
          <strong>Preis:</strong> {{ flight.price.total }}
          {{ flight.price.currency }}
        </p>
        <p class="flight-detail">
          <strong>Fluggesellschaft:</strong>
          {{ flight.itineraries[0].segments[0].carrierCode }}
        </p>
        <p class="flight-detail">
          <strong>Flugnummer:</strong>
          {{ flight.itineraries[0].segments[0].number }}
        </p>
        <p class="flight-detail">
          <strong>Flugzeugtyp:</strong>
          {{ flight.itineraries[0].segments[0].aircraft.code }}
        </p>
      </div>
    </div>
    <div class="hotel-container" v-else>
      <div v-for="(hotel, index) in hotels" :key="index" class="hotel-info">
        <p><strong>Name:</strong> {{ hotel.name }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "StartingPage",
  data() {
    return {
      cityName: "",
      cities: [],
      destinationName: "",
      destinations: [],
      flights: [],
      departure: "", // Neu: Variable für das Abfahrtsdatum
      arrival: "", // Neu: Variable für das Ankunftsdatum
      hotels: [],
      adults: 1, // Standardwert für Erwachsene
      children: 0, // Standardwert für Kinder
      infants: 0,
      returnDate: "",
      travelClass: "ECONOMY",
      nonStop: false,
      maxPrice: "",
      showAdvancedOptions: false,
      filterType: "Flüge",
    };
  },

  mounted() {
    // Beispiel für das Setzen eines Hintergrundbildes, angepasst an deine Projektstruktur
    document.documentElement.style.setProperty(
      "--background-image-url",
      `url(${require("@/assets/background2.png")})`
    );
  },
  methods: {
    async searchFlightsAndHotels() {
      try {
        await this.searchFlights(); // Aufruf der Methode zur Flugsuche
        await this.searchHotels(); // Aufruf der Methode zur Hotelsuche
      } catch (error) {
        console.error("Fehler beim Suchen von Flügen und Hotels:", error);
      }
    },

    formatDate(date) {
      return new Date(date).toLocaleString(); // Ändern Sie das Datum in das gewünschte Format
    },
    toggleFilter() {
      // Wenn der aktuelle Filter Flüge sind, ändere ihn auf Hotels und umgekehrt
      this.filterType = this.filterType === "Flüge" ? "Hotels" : "Flüge";
    },
    async searchFlights() {
      try {
        // Verwende parseInt, um sicherzustellen, dass die Werte als Zahlen übergeben werden.
        const response = await axios.post(
          "http://localhost:3000/search-flights",
          {
            departure: this.departure,
            locationDeparture: this.cityName,
            locationArrival: this.destinationName,
            adults: this.adults,
            children: this.children,
            infants: this.infants,
            travelClass: this.travelClass,
            nonStop: this.nonStop,
            maxPrice: this.maxPrice,
            returnDate: this.returnDate, // Entferne das 'arrival' Feld, es wird nicht benötigt.
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        console.log(response.data); // Nach dem Empfang der Antwort von der API
        this.flights = response.data; // oder response.data.data, je nach Struktur der Antwort

        this.flights = response.data;
      } catch (error) {
        console.error("Fehler beim Suchen von Flügen:", error);
      }
    },

    async searchHotels() {
      try {
        const response = await axios.post(
          "http://localhost:3000/search-hotels",
          {
            location: this.destinationName, // Verwenden Sie den City Code des Zielortes
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        console.log(response.data); // Logge die Antwort, um ihre Struktur zu überprüfen
        this.hotels = response.data; // oder passen Sie diesen Pfad entsprechend der tatsächlichen Antwortstruktur an
      } catch (error) {
        console.error("Fehler beim Suchen von Hotels:", error);
      }
    },

    async searchCities() {
      if (this.cityName.length < 3) {
        this.cities = []; // Leere die Liste, wenn weniger als 3 Buchstaben eingegeben wurden
        return; // Beende die Methode vorzeitig
      }

      try {
        const response = await axios.get(
          `http://localhost:3000/search-cities?keyword=${this.cityName}`
        );
        this.cities = response.data.data; // Aktualisiere die Liste mit den neuen Vorschlägen
      } catch (error) {
        console.error("Fehler beim Abrufen der Städte:", error);
        this.cities = []; // Leere die Liste im Fehlerfall
      }
    },

    async searchDestinations() {
      if (this.destinationName.length < 3) {
        this.destinations = []; // Leere die Liste, wenn weniger als 3 Buchstaben eingegeben wurden
        return; // Beende die Methode vorzeitig
      }

      try {
        const response = await axios.get(
          `http://localhost:3000/search-cities?keyword=${this.destinationName}`
        );
        this.destinations = response.data.data; // Aktualisiere die Liste mit den neuen Vorschlägen
      } catch (error) {
        console.error("Fehler beim Abrufen der Ziele:", error);
        this.destinations = []; // Leere die Liste im Fehlerfall
      }
    },
    selectCity(city) {
      this.cityName = city.iataCode; // Setze den IATA-Code als Wert des Input-Feldes
      this.cities = []; // Leere die Liste der Vorschläge
    },

    selectDestination(destination) {
      this.destinationName = destination.iataCode; // Setze den IATA-Code als Wert des Input-Feldes
      this.destinations = [];
      this.hotels = []; // Leere die Liste der Vorschläge
    },
    toggleAdvancedOptions() {
      this.showAdvancedOptions = !this.showAdvancedOptions;
    },
  },
};
</script>
<style>
html,
body {
  font-family: "Brandon Grotesque Black";
  margin: 0;
  padding: 0;
  overflow: hidden; /* Verhindert das Scrollen auf der Seite */
  height: 100%; /* Stellt sicher, dass html und body den gesamten Bildschirm ausfüllen */
  width: 100%; /* Stellt sicher, dass html und body den gesamten Bildschirm ausfüllen */
}
.hinflug{
  padding-left: 25px;
}

.erwachsene {
  padding-left: 25px;
}
.reiseklasse{
  padding-bottom: 20px;
}

.wrapper {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background-image: var(--background-image-url);
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow-y: auto; /* Vertikalen Scrollbalken anzeigen, wenn der Inhalt zu groß wird */
}

.digga {
  background-color: white;
  border-radius: 5px;
}
.Datum {
  margin-right: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
}
.flight-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 20px; /* Abstand zwischen den Containern */
}

.flight-info {
  margin-top: 50px;
  margin-right: 10px;
  width: 200px; /* Breite auf 50% des Containers minus Abstand */
  max-width: 400px; /* Maximale Breite des Containers */
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 20px; /* Abstand zwischen den Containern */
  background-color: rgb(51, 50, 48);
}

.flight-container {
  display: flex; /* Container als Flex-Container anzeigen */
  flex-wrap: wrap; /* Elemente umbrechen, wenn nicht genügend Platz vorhanden ist */
  justify-content: center; /* Zentrieren Sie die Container horizontal */
}

.segment-info {
  margin-bottom: 10px;
}

.flight-detail {
  color: white; /* Ändern Sie die Farbe nach Ihren Wünschen */
  font-family: "Brandon Grotesque Black", sans-serif; /* Ändern Sie die Schriftart nach Ihren Wünschen */
  margin: 5px 0; /* Fügen Sie einen Abstand zwischen den Flugdetails hinzu */
  margin: 5px 0;
} /* Fügen Sie einen Abstand zwischen den Flugdetails hinzu */

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

h4 {
  margin-right: 20px;
}

.underline {
  height: 2px;
  background-color: currentColor;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
  margin-top: 10px;
}

.checkbox {
  margin-left: 5px; /* Kleinerer Abstand zur Checkbox */
  padding: 0px;
  width: 50px;
}

.checkboxLabel {
  margin-right: 10px;
  width: auto; /* Entferne eine feste Breite, falls vorhanden */
  font-weight: bold;
}

.checkboxGroup {
  display: flex;
  align-items: center;
}

.label {
  margin-left: 0 !important;
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
  margin-bottom: 20px;
  margin-right: 20px;
}

.routePlanner input {
  width: 220px;
  height: 30px;
  border-radius: 10px;
  border: none;
  background-color: white; /* Hintergrund zu reinem Weiß für bessere Sichtbarkeit */
  color: black; /* Schriftfarbe zu Schwarz geändert für besseren Kontrast */
  margin-right: 20px;
}

.plan {
  width: 200px;
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

.icon,
.buttonIcon {
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
  align-items: center; /* Zentriert die Elemente vertikal */
  width: 100%;
  position: relative;
}

.inputWithIcon {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}


/* Anpassungen für das routePlanner-Div, um Platz für das Dropdown zu schaffen */
.routePlanner {
  padding-bottom: 80px; /* Erhöhe den unteren Abstand, um Platz für das Dropdown zu schaffen */
}

.travelClassSelect {
  width: 100%; /* Vollständige Breite für das Select-Element */
  max-width: 220px; /* Maximale Breite für das Select-Element */
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

.hotel-container {
  margin-top: 20px;
}

.hotel-info {
  background-color: #f0f0f0;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
}

select {
  text-align-last: center; /* Zentriert den Text im Dropdown */
  width: 220px;
  height: 30px;
}
</style>
