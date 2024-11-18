
import { NextApiRequest, NextApiResponse } from 'next';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../../../swagger'; // Import the swaggerSpec we configured

// This will serve the Swagger UI
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        swaggerUi.serve(req, res, () => {
            swaggerUi.setup(swaggerSpec)(req, res);
        });
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}