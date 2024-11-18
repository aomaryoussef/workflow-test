package apis.partner.partnerEndpoints;

import apis.partner.partnerPayloads.updateUserProfilePayload.*;
import apis.routes.Routes;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;

public class UpdateUserProfileEndpoint {
    public static Response UpdateUserProfile(UpdateUserProfile payload, String partnerID, String UserProfileID){
        Response UpdateUserProfileResponse = RestAssured.given()
                .contentType(ContentType.JSON)
                .accept(ContentType.JSON)
                .body(payload)
                .pathParam("partner_id", partnerID)
                .pathParam("user_profile_id", UserProfileID)
                .when()
                .patch(Routes.Patch_User_Profile_url);
        return UpdateUserProfileResponse;
    }
}
