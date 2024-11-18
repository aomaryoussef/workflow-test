import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const phone_number = req.nextUrl.searchParams.get("phone_number")?.trim();
    console.log(process.env.OL_BFF_GRAPHQL_URL, "Graph URL");
    const res = await axios.post(process.env.OL_BFF_GRAPHQL_URL!, {
      query: ` query FindConsumer {
      consumers(where: {phone_number: {_eq: "+2${phone_number}"}}  ) {
      id
      iam_id
      full_name
      national_id
      loans {
        loan_schedules {
          due_date
          due_interest
          due_late_fee
          due_principal
          is_cancelled
          id
          loan_id
          paid_date
        }
        loan_schedules_aggregate(where: {}) {
          aggregate {
            count
          }
        }
      }
    }
  }
`,
    });
    return NextResponse.json({ data: res.data });
  } catch (error) {
    console.log(error, "error next");
    return NextResponse.error();
  }
}
