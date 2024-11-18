import {BackOfficeActions} from "@/app/[locale]/back-office/common/enums/backoffice.enums.ts";

export const generateUserActions = (userGroup?: string[] | null) => {
    const userActions = new Set<BackOfficeActions>();
    switch (!!userGroup?.length) {
        case userGroup?.includes("relationshipManagers"):
            userActions.add(BackOfficeActions.CREATE_PARTNER);
            userActions.add(BackOfficeActions.CREATE_PARTNER_STORE);
            userActions.add(BackOfficeActions.SEARCH_PARTNERS);
            break;
        case userGroup?.includes("branchEmployees"):
            userActions.add(BackOfficeActions.CREATE_CONSUMER);
            userActions.add(BackOfficeActions.SEARCH_CONSUMERS);
            userActions.add(BackOfficeActions.PRINT_CONSUMER_DOCUMENTS);
            userActions.add(BackOfficeActions.ACTIVATE_CONSUMER);
            break;
        case userGroup?.includes("collectionAgents"):
            userActions.add(BackOfficeActions.MAKE_COLLECTION);
            userActions.add(BackOfficeActions.VIEW_CONSUMER);
            userActions.add(BackOfficeActions.LIST_TRANSACTIONS);
            break;
    }
    return userActions;
};