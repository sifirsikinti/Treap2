const express = require("express");
const axios = require("axios");
const qs = require("qs");
const cors = require("cors");
const Amadeus = require("amadeus");

const app = express();
app.use(cors()); // Ermögliche CORS für alle Anfragen
app.use(express.json());

const port = 3000;

const AMADEUS_CLIENT_ID = "VGrjvtJs0sokLE1WWuUDYlvnMmL1ake1";
const AMADEUS_CLIENT_SECRET = "MsSt3tV5ENRR3uQl";

const amadeus = new Amadeus({
  // Initialisieren Sie die Amadeus-API-Bibliothek mit Ihren Anmeldeinformationen
  clientId: AMADEUS_CLIENT_ID,
  clientSecret: AMADEUS_CLIENT_SECRET,
});

let cachedToken = {
  value: null,
  expiry: null,
};

async function getAccessToken() {
  const now = new Date();
  if (cachedToken.value && cachedToken.expiry && now < cachedToken.expiry) {
    return cachedToken.value;
  }

  const tokenUrl = "https://test.api.amadeus.com/v1/security/oauth2/token";
  const data = qs.stringify({
    client_id: AMADEUS_CLIENT_ID,
    client_secret: AMADEUS_CLIENT_SECRET,
    grant_type: "client_credentials",
  });

  try {
    const response = await axios.post(tokenUrl, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const expiry = new Date(
      now.getTime() + response.data.expires_in * 1000 - 60000
    ); // Adjust expiry time
    cachedToken = {
      value: response.data.access_token,
      expiry: expiry,
    };
    console.log("Access Token:", response.data.access_token);
    return response.data.access_token;
  } catch (error) {
    console.error(
      "Fehler beim Anfordern des Access Tokens:",
      error.response ? error.response.data : error.message
    );
    throw error; // Für außerhalb der Funktion sichtbar machen
  }
}

app.get("/search-cities", async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    const keyword = req.query.keyword;
    const amadeusResponse = await axios.get(
      `https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY&keyword=${keyword}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    res.json(amadeusResponse.data);
  } catch (error) {
    console.error("Fehler bei der Städtesuche:", error);
    res
      .status(500)
      .json({ message: "Interner Serverfehler", error: error.toString() });
  }
});

app.post("/search-flights", async (req, res) => {
  // Ihre existierenden Parameter…
  const {
    departure,
    locationDeparture,
    locationArrival,
    adults,
    children = 0,
    infants = 0,
    travelClass = "ECONOMY",
    nonStop = false,
    maxPrice,
    returnDate,
  } = req.body;

  try {
    const accessToken = await getAccessToken(); // Zugriffstoken abrufen

    // Parametervorbereitung für die API-Anfrage
    let searchParams = {
      originLocationCode: locationDeparture,
      destinationLocationCode: locationArrival,
      departureDate: departure,
      adults: parseInt(adults),
      travelClass: travelClass,
      nonStop: nonStop,
      returnDate: returnDate || undefined,
    };

    if (children > 0) searchParams.children = parseInt(children);
    if (infants > 0) searchParams.infants = parseInt(infants);
    if (maxPrice) searchParams.maxPrice = maxPrice;

    const amadeusResponse = await axios.get(
      `https://test.api.amadeus.com/v2/shopping/flight-offers`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: searchParams,
      }
    );

    let flights = amadeusResponse.data.data;

    // Filtern Sie Flüge basierend auf maxPrice, wenn angegeben
    if (maxPrice) {
      flights = flights.filter(
        (flight) => parseFloat(flight.price.total) <= parseFloat(maxPrice)
      );
    }

    // Sortieren Sie die Flüge nach Preis und begrenzen Sie das Ergebnis auf die 10 günstigsten
    flights.sort(
      (a, b) => parseFloat(a.price.total) - parseFloat(b.price.total)
    );
    flights = flights.slice(0, 10);

    res.json(flights);
  } catch (error) {
    console.error(
      "Error searching flights:",
      error.response ? error.response.data : error.message
    );
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.toString() });
  }
});

app.post("/search-hotels", async (req, res) => {
  const { location } = req.body;
  try {
    const accessToken = await getAccessToken(); // Stellen Sie sicher, dass Sie einen gültigen Zugriffstoken haben
    const hotelListUrl = `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=${location}`;
    const response = await axios.get(hotelListUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const hotels = response.data.data.slice(0, 10);
    res.json(hotels);
  } catch (error) {
    console.error(
      "Fehler bei der Hotelsuche:",
      error.response ? error.response.data : error.message
    );
    res
      .status(500)
      .json({ message: "Interner Serverfehler", error: error.toString() });
  }
});

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
