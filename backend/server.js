const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parse');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());
