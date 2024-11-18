import { NextRequest, NextResponse } from 'next/server';

import { getUserGroups } from '@/app/services/keto.ts';

export async function GET(req: NextRequest) {
  try {
    let defaultURL = '/back-office';

    const iamId = req.headers.get('x-user-iam-id');
    if (iamId) {
      const userGroups = (await getUserGroups(iamId)) ?? [];

      if (userGroups.includes('relationshipManagers')) {
        defaultURL = `/back-office/private/partners/create`;
      } else if (userGroups.includes('branchEmployees')) {
        defaultURL = `/back-office/private/consumers/activate`;
      }
    }

    return NextResponse.json({ defaultURL });
  } catch (error) {
    return NextResponse.json({ data: error });
  }
}

export const methods = ['GET'];
