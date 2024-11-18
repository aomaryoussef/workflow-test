// swagger.js
import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Next.js API Documentation',
        version: '1.0.0',
        description: 'API documentation for consumer credit limit API',
    },
    servers: [
        {
            url: 'http://localhost:3000/api', // Replace with your actual API server URL
            description: 'Development server',
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./pages/api/*.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;