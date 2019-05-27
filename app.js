var express = require('express');
var app = express();
const cors = require('cors');
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Cimemex',
  password: 'admin',
  port: 5432,
});
app.configure(function () {
  app.use(express.bodyParser());
})
app.use(cors());

app.get('/peliculas', async function (req, res) {
  pool.query('SELECT * FROM pelicula', (error, results) => {
    if (error) {
      throw errorno
    }
    res.status(200).json(results.rows)
  });
});

app.get('/peliculas/:id', async function (req, res) {
  const { id } = req.params;
  pool.query(`SELECT * FROM pelicula WHERE id='${id}'`, (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  });
});

app.post('/login', async function (req, res) {
  const { email, pass } = req.body;
  pool.query(`SELECT * FROM empleado WHERE email='${email}' AND pass=MD5('${pass}')`, (error, results) => {
    if (error) {
      throw error
    }
    if (results.rows.length > 0) {
      res.status(200).json(results.rows)
    }
    else {
      res.status(404).json('Datos invalidos')
    }
  });
})

app.post('/peliculas', async function (req, res) {
  const { name, length, classification } = req.body;
  const { genre, synopsis, starring } = req.body;
  const { url, projection } = req.body;
  pool.query(`INSERT INTO pelicula(nombre, sinopsis, duracion, reparto, clasificacion, tipo_proyeccion, genero, imagen) 
  VALUES ('${name}', '${synopsis}', '${length}', '${starring}', '${classification}', '${projection}', '${genre}', '${url}') RETURNING *`, (error, results) => {
      if (error) {
        res.status(404).json(error)
      }
      res.status(200).json('Guardado exitoso');
    })
});

app.get('/peliculas/:id/cartelera', async function (req, res) {
  const { id } = req.params;
  pool.query(`SELECT * FROM cartelera WHERE pelicula='${id}'`, (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  });
});

app.get('/salas/:id', async function (req, res) {
  const { id } = req.params;
  pool.query(`SELECT * FROM sala WHERE id='${id}'`, (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  });
});


app.post('/tickets', async function (req, res) {
  const { folio, billboard, ticketNumber } = req.body;
  const { seatNumber, customerName, creditCard } = req.body;
  pool.query(`INSERT INTO ticket(folio, cartelera, cantidad_boletos, numero_asiento, nombre_comprador, terminacion_credito) 
  VALUES ('${folio}', '${billboard}', ${ticketNumber}, ARRAY[${seatNumber}], '${customerName}', '${creditCard}') RETURNING *`, (error, results) => {
      if (error) {
        res.status(404).json(error)
      }
      res.status(200).json(results.rows[0].id);
    })
});

app.get('/tickets/:id', async function (req, res) {
  const { id } = req.params;
  pool.query(`SELECT * FROM ticket WHERE id='${id}'`, (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  });
});

app.get('/cartelera/:id', async function (req, res) {
  const { id } = req.params;
  pool.query(`SELECT * FROM cartelera WHERE id='${id}'`, (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  });
});

var port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on ${port}`));

module.exports = app;