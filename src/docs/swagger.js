const swaggerUi = require('swagger-ui-express');
const swaggerAutogen = require('swagger-autogen')();
const outputFile = './swagger_output.json';
const endpointsFiles = ['../../routes/*.js'];
// module.exports = (app) => {
//   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// };
swaggerAutogen(outputFile, endpointsFiles)
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API Title',
      version: '1.0.0',
      description: 'Ecommerce API',
    },
  },
  apis: ['../../routers/*.js'], // Replace with the path to your route files
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = swaggerSpec;
