import { Request, Response, NextFunction } from "express";
// Function to generate a 10-digit random number
function generateRandomNumber(): number {
  return Math.floor(1000000000 + Math.random() * 9000000000);
}

// Middleware to check for x-trace-id and generate if it doesn't exist
function traceId(req: Request, res: Response, next: NextFunction) {
  let traceId = req.headers["x-trace-id"];
  if (!traceId) {
    const epochTime = Math.floor(Date.now() / 1000); // Get current epoch time in seconds
    const randomNumber = generateRandomNumber(); // Generate a 10-digit random number
    traceId = `${epochTime}${randomNumber}`;
    req.headers["x-trace-id"] = traceId; // Combine epoch time and random number
  }
  next();
}

export default traceId;
