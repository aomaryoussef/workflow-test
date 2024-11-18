import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const res = await axios.post(process.env.OL_BFF_GRAPHQL_URL!, {
      query: `query getPartners {
      partner {
        id
        name
      }
    }`,
    });
    return NextResponse.json({ data: res.data });
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
