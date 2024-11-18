import swaggerAutogenImport from "swagger-autogen";

const swaggerAutogen = swaggerAutogenImport();

const doc = {
    info: {
        title: 'Next.js API',
        description: 'API documentation for the Next.js app',
    },
    host: 'localhost:3000',
    schemes: ['http'],
};

const outputFile = './swagger-output.json';  // Generated Swagger spec
const endpointsFiles = ['./pages/api/*.ts']; // Path to your API endpoints

// Generate the Swagger spec based on the API routes
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log('Swagger documentation has been generated');
});
