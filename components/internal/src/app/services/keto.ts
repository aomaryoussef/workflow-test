import {
    Configuration,
    PermissionApi,
    PermissionApiCheckPermissionRequest,
    RelationshipApi,
    RelationshipApiGetRelationshipsRequest,
  } from "@ory/keto-client";

const config = {
    ketoReadBaseURL: process.env.OL_BFF_KETO_READ_BASE_URL,
};
  
  const ketoReadConfig = new Configuration({ basePath: config.ketoReadBaseURL });
  const ketoPermissionsRead = new PermissionApi(ketoReadConfig);
  const ketoRelationshipsRead = new RelationshipApi(ketoReadConfig);
  
  export const isUserInGroup = async (group: string, user_iam_id: string) => {
    try {
      const request: PermissionApiCheckPermissionRequest = {
        namespace: "Group",
        object: group,
        relation: "members",
        subjectId: user_iam_id,
      };
      const response = await ketoPermissionsRead.checkPermission(request);
      return response.data.allowed;
    } catch (error) {
      console.error(error);
      return false;
    }
  };
  
  export const isPartnerUser = async (partnerId: string, userIamId: string, relation: string) => {
    try {
      const request: PermissionApiCheckPermissionRequest = {
        namespace: "Partner",
        object: partnerId,
        relation: relation,
        subjectId: userIamId,
      };
      const response = await ketoPermissionsRead.checkPermission(request);
      return response.data.allowed;
    } catch (error) {
      console.error(error);
      return false;
    }
  };
  
  export const canUserDoAction = async (userIamId: string, action: string) => {
    try {
      const request: PermissionApiCheckPermissionRequest = {
        namespace: "Organization",
        object: "b_labs",
        relation: action,
        subjectId: userIamId,
      };
      const response = await ketoPermissionsRead.checkPermission(request);
      return response.data.allowed;
    } catch (error) {
      console.error(error);
      return false;
    }
  };
  
  export const getUserGroups = async (user_iam_id: string) => {
    try {
      const request: RelationshipApiGetRelationshipsRequest = {
        namespace: "Group",
        relation: "members",
        subjectId: user_iam_id,
      };
      const response = await ketoRelationshipsRead.getRelationships(request);
  
      return response.data.relation_tuples?.map((item) => item.object);
    } catch (error) {
      console.error(error);
      return ["none"];
    }
  };
  