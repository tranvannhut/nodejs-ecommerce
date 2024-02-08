// const swaggerUi = require('swagger-ui-express');
// const swaggerAutogen = require('swagger-autogen')();
// const outputFile = './swagger_output.json';
// const endpointsFiles = ['./src/routers/*.js'];
// // module.exports = (app) => {
// //   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// // };
// swaggerAutogen(outputFile, endpointsFiles);

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerAutogen = require('swagger-autogen')();

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ecommerce APP',
      version: '1.0.0',
      description: 'Ecommerce API on swagger',
    },
  },
  apis: ['./src/routers/*.js'], // Adjust the path accordingly
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

swaggerAutogen(swaggerSpec).then(() => {
  console.log(`Swagger documentation generated successfully`);
});
module.exports = swaggerSpec;
