import { cookies, headers } from 'next/headers';

import { BackOfficeActions } from '@/app/[locale]/back-office/common/enums/backoffice.enums.ts';
import { canUserDoAction, getUserGroups } from '@/app/services/keto.ts';
import { generateUserActions } from '@common/helpers/auth.helpers.ts';
import { AuthBindings } from '@refinedev/core';

type ExtendedAuthBindings = AuthBindings & {
  canUserDo: (action: BackOfficeActions) => Promise<{
    allowed: boolean;
    userActions: Set<BackOfficeActions>;
  }>;
};

export const authProviderServer: Pick<ExtendedAuthBindings, 'check' | 'canUserDo'> = {
  check: async () => {
    const cookieStore = cookies();
    const auth = cookieStore.get('ory_kratos_session');
    const locale = cookieStore.get('NEXT_LOCALE');
    if (auth) {
      try {
        const iamId = headers().get('x-user-iam-id');
        if (iamId) {
          const userGroups = await getUserGroups(iamId);
          if (userGroups?.includes('relationshipManagers')) {
            return {
              authenticated: true,
              userGroup: userGroups,
              redirectTo: `/en/back-office/private/partners/create`,
            };
          }
        }
        return {
          authenticated: true,
          userGroups: null,
          redirectTo: `/en/back-office/private/partners/create`,
        };
      } catch (error) {
        return {
          authenticated: false,
          userGroups: null,
          logout: true,
          redirectTo: `/${locale?.value}/back-office/public/login`,
        };
      }
    }
    return {
      authenticated: false,
      logout: true,
      userGroups: null,
      redirectTo: `/${locale?.value}/back-office/public/login`,
    };
  },
  canUserDo: async (action: BackOfficeActions) => {
    const iamId = headers().get('x-user-iam-id');
    let allowed = null;
    let userGroup = null;
    if (iamId) {
      allowed = await canUserDoAction(iamId, action);
      userGroup = await getUserGroups(iamId);
      if (allowed) {
        const userActions = generateUserActions(userGroup);
        return {
          allowed,
          userActions,
        };
      }
    }
    return {
      allowed: false,
      userActions: new Set<BackOfficeActions>(),
    };
  },
};
