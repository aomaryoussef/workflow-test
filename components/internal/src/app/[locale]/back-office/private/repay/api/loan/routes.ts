import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const phone_number = req.nextUrl.searchParams.get("phone_number")?.trim();
    console.log(process.env.OL_BFF_GRAPHQL_URL);
    const res = await axios.post(process.env.OL_BFF_GRAPHQL_URL!, {
      query: `query FindConsumer {
    consumers(where: {phone_number: {_eq: "+2${phone_number}"}}) {
      id
      full_name
      national_id
      status
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
