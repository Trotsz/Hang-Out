/* eslint-disable no-undef */
const express = require('express');
const cors = require('cors');
const { errors } = require('celebrate');
const routes = require('./routes');
const app = express();
const cookieParser = require('cookie-parser')

app.use(cors());
app.use(express.json());
app.use(cookieParser())
app.use(routes);
app.use(errors())
app.listen(3333);
