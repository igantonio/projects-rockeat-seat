const express = require('express');
const cors = require('cors');
const { errors } = require('celebrate');
const routes = require('./routes');

const app = express();

app.use(cors());//Deixar desse moto faz com que todas aplicações front-end acessem minha aplicação

app.use(express.json()); // Para que as rotas possam receber dados JSON

app.use(routes);

app.use(errors());

module.exports = app;