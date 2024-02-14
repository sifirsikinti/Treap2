const express = require('express');
const axios = require('axios');
const qs = require('qs');
const cors = require('cors');

const app = express();
app.use(cors()); // Ermögliche CORS für alle Anfragen

const port = 3000;

const AMADEUS_CLIENT_ID = 'VGrjvtJs0sokLE1WWuUDYlvnMmL1ake1';
const AMADEUS_CLIENT_SECRET = 'MsSt3tV5ENRR3uQl';

let cachedToken = {
  value: null,
  expiry: null,
};

async function getAccessToken() {
  const now = new Date();
  if (cachedToken.value && cachedToken.expiry && now < cachedToken.expiry) {
    return cachedToken.value;
  }

  const tokenUrl = 'https://test.api.amadeus.com/v1/security/oauth2/token';
  const data = qs.stringify({
    client_id: AMADEUS_CLIENT_ID,
    client_secret: AMADEUS_CLIENT_SECRET,
    grant_type: 'client_credentials',
  });

  try {
    const response = await axios.post(tokenUrl, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const expiry = new Date(now.getTime() + response.data.expires_in * 1000 - 60000); // Adjust expiry time
    cachedToken = {
      value: response.data.access_token,
      expiry: expiry,
    };
    console.log('Access Token:', response.data.access_token);
    return response.data.access_token;
  } catch (error) {
    console.error('Fehler beim Anfordern des Access Tokens:', error.response ? error.response.data : error.message);
    throw error; // Für außerhalb der Funktion sichtbar machen
  }
}


app.get('/search-cities', async (req, res) => {
    try {
      const accessToken = await getAccessToken();
      const keyword = req.query.keyword;
      const amadeusResponse = await axios.get(`https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY&keyword=${keyword}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
  
      res.json(amadeusResponse.data);
    } catch (error) {
      console.error('Fehler bei der Städtesuche:', error);
      res.status(500).json({ message: 'Interner Serverfehler', error: error.toString() });
    }
});

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});