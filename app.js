var express = require('express');
var app = express();
const cors = require('cors');
var cities = {cities:["Amsterdam","Berlin","New York","San Francisco","Tokyo"]}
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Cimemex',
  password: 'admin',
  port: 5432,
});

app.use(cors());

app.get('/peliculas', async function(req, res){
  pool.query('SELECT * FROM pelicula', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  });
});

app.get('/peliculas/:id', async function(req, res){
  const { id } = req.params;
  pool.query(`SELECT * FROM pelicula WHERE id='${id}'`, (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  });
});


var port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on ${ port }`));

module.exports = app;