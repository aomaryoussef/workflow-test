package apis.partner.partnerEndpoints;

import apis.routes.Routes;
import io.restassured.RestAssured;
import io.restassured.response.Response;

public class PartnerUsersEndpoints {
    public static Response GetAllPartnerUsers() {
        Response GetAllPartnerUsersResponse = RestAssured.given()
                .when()
                .get(Routes.Get_Partner_Users_url);
        return GetAllPartnerUsersResponse;
    }
}
