import { Request, Response } from "express";
import receiptline from "receiptline";
import { CustomLogger } from "../../../../services/logger";
import { findPayment } from "../../../../services/formance";

const logger = new CustomLogger("registry-controller");

const getReceipt = async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;
    logger.debug(`get receipt for payment with reference ${paymentId}`);
    const formancePayment = await findPayment(paymentId);
    const collectionBranch =
      formancePayment.metadata.paymentChannel === "BTECH_STORE_CASH"
        ? `| Branch | ${formancePayment.metadata.collectionBranchCode} |`
        : "";
    const collectionAgent =
      formancePayment.metadata.paymentChannel === "BTECH_STORE_CASH"
        ? `| Agent | ${formancePayment.metadata.collectionAgentEmail.split("@")[0]} |`
        : "";
    const paymentChannel =
      formancePayment.metadata.paymentChannel == "BTECH_STORE_CASH"
        ? "B.Tech Store"
        : formancePayment.metadata.paymentChannel == "FAWRY"
          ? "Fawry"
          : formancePayment.metadata.paymentChannel;
    const receiptTitle = JSON.parse(formancePayment.metadata.myloRepayments.replaceAll("'", '"'))[0]
      .collected_as_early_settlement
      ? "Early Settlement"
      : "Payment Receipt";
    const paymentTime = new Date(formancePayment.createdAt)
      .toLocaleString("en-IN", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        timeZone: "Africa/Cairo",
      })
      .replace("am", "AM")
      .replace("pm", "PM")
      .replace(",", "")
      .replaceAll("/", "-");
    const printTime = new Date()
      .toLocaleString("en-IN", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        timeZone: "Africa/Cairo",
      })
      .replace("am", "AM")
      .replace("pm", "PM")
      .replace(",", "")
      .replaceAll("/", "-");
    const doc = `{border:line}
    
        {image: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}
    
        ^^^ ${receiptTitle} ^^^
    
        \`^^^^^ ${(Number(formancePayment.amount) / 100).toFixed(2)} ^^^^^\`

        {w:*,*;b:line}
        -
        | Payment Time | ${paymentTime} |
        | Print Time | ${printTime} |
        | Channel | ${paymentChannel} |
        ${collectionBranch}
        ${collectionAgent}
        -
        {w:auto;b:space}
        
        {border:line}
        
        {code:https://myloapp.com/public/registry/receipts/${formancePayment.reference}; option:qrcode,3,L}
  
        Thank you for your payment!
        
        www.myloapp.com
        support@btech.com
  
        📞 15070
  
        Ref: _${formancePayment.reference}_
        =
        ${formancePayment.reference}
        {code:${formancePayment.reference}; option:code128,2,72,nohri}
        `;
    const display = {
      cpl: 42,
    };
    const svg = receiptline.transform(doc, display);
    res.send(svg);
  } catch (err) {
    logger.error(err);
    return res.status(400).send(err);
  }
};

export default { getReceipt };
