require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');


const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// Token-Cache (einfache Implementierung, für Produktionscode verbessern)
let accessToken = '';
let tokenExpires = 0;

async function getAccessToken() {
  if (Date.now() < tokenExpires) return accessToken;

  const response = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token', `grant_type=client_credentials&client_id=${process.env.AMADEUS_CLIENT_ID}&client_secret=${process.env.AMADEUS_CLIENT_SECRET}`, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  accessToken = response.data.access_token;
  // Setzt ein Ablaufdatum für den Token (etwas weniger als die tatsächliche Ablaufzeit, um Sicherheitsmargen zu gewährleisten)
  tokenExpires = Date.now() + response.data.expires_in * 1000 - 60000;

  return accessToken;
}

app.get('/search-cities', async (req, res) => {
    try {
      const accessToken = await getAccessToken();
      const { keyword } = req.query;
      const response = await axios.get(`https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY&keyword=${keyword}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
  
      res.json(response.data);
    } catch (error) {
      console.error('Fehler bei der Verarbeitung der Anfrage:', error);
      res.status(500).json({ message: 'Interner Serverfehler', error: error.toString() });
    }
  });
  

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
