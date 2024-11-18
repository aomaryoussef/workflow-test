import { Request, Response } from "express";

export const httpRequestLogger = (tokens: any, req: Request, res: Response) => {
  try {
    const statusCode = tokens.status(req, res);
    const responseTime = tokens["response-time"](req, res);
    const traceId = req.headers["x-trace-id"];
    const iamId = req.headers["x-user-iam-id"];
    if (!traceId) {
      return null;
    }
    const method = tokens.method(req, res);
    const assetFilePattern = /\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|map)$/;
    const specificUrlPattern = /^\/public\/shared\/fonts\/icomoon\/icomoon\.ttf\?.*$/;
    const url = tokens.url(req, res);
    if (assetFilePattern.test(url) || specificUrlPattern.test(url)) {
      return null;
    }
    // Skip pod health check requests
    if (method === "GET" && url === "/") {
      return null;
    }
    const timestamp = new Date().toISOString();
    const logParts = [
      timestamp,
      "-",
      traceId,
      "_",
      method,
      url,
      statusCode,
      tokens.res(req, res, "content-length"),
      "-",
      responseTime,
      "ms",
    ];
    if (iamId) {
      logParts.splice(1, 0, `- ${iamId}`);
    }
    //Expected output
    // timestamp - iam id - traceId - method url statusCode content-length - responseTime ms
    // 2024-09-25T07:15:51.738Z -:29fb713e-8935-4e71-9d74-910fac9017bd - 17272485518988478175 _ POST /private/partner/checkout/search-consumer 404  - 132.505 ms
    return logParts.join(" ");
  } catch (err) {}
};
