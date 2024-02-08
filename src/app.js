require('dotenv').config();
const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const router = require('./routers/index');
const swaggerUi = require('swagger-ui-express');
// const swaggerFile = require('../swagger_output.json');
const swaggerSpec = require('../swagger'); // Adjust the path accordingly

const cors = require("cors");
const app = express();

// 1. Serve Swagger UI at /api-docs
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
// Serve Swagger UI at /api-docs
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// 2. init middleware
app.use(cors());
// tracking event
app.use(morgan('dev')); // morgan("combined") / morgan("common") /morgan("short") /morgan("tiny")

// protects your application from XSS attacks
app.use(helmet());

// compression package application
app.use(compression());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// 3. init db and configDB
require('./dbs/iniut.mongodb.lv1');
// const { checkOverload } = require("./helpers/check.connection");
// checkOverload();

// 4. init router
app.use('', router);

// 5. handling error
app.use((req, res, next) => {
  const error = new Error('Not Found!');

  error.status = 404;
  next(error);
});
app.use((error, req, res) => {
  const statusCode = error.status || 500;
  const statusName = error.name;
  if (statusName === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token has expired' });
  }
  return res.status(statusCode).json({
    // status: "error",
    status: statusCode,
    message: error.message || 'Internal Server error',
  });
});

module.exports = app;
