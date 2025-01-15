// src/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const getproductRoutes = require('../routes/scrap');
const cheerio = require('cheerio');
const axios = require('axios');



const app = express();
const PORT = process.env.PORT || 5000;
let data = [];

// Connect to MongoDB

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use('/api/get_product', getproductRoutes);



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
