import swaggerJSDoc from 'swagger-jsdoc';
import glob from 'glob';

const schema = swaggerJSDoc({
  swaggerDefinition: {
    info: {
      title: 'Notary Validator API',
      version: '1.0.0',
    },
  },
  apis: glob.sync(`${__dirname}/routes/**/*.js`),
});

export default schema;
