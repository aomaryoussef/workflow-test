package apis.partner.partnerEndpoints;


import apis.partner.partnerPayloads.cashierPayload.*;
import apis.routes.Routes;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;

public class CashierEndpoints {
    public static Response createCashier(Cashier payload, String partnerID) {
        Response createCashierResponse = RestAssured.given()
                .contentType(ContentType.JSON)
                .accept(ContentType.JSON)
                .body(payload)
                .pathParam("partner_id", partnerID)
                .when()
                .post(Routes.Post_Cashier_url);
        return createCashierResponse;
    }
    public static Response GetPartnersCashiers(Cashier payload, String partnerID){
        Response GetPartnersCashiersResponse = RestAssured.given()
                .contentType(ContentType.JSON)
                .accept(ContentType.JSON)
                .body(payload)
                .pathParam("partner_id", partnerID)
                .when()
                .get(Routes.Get_All_Cashiers_by_PartnerID_url);
        return GetPartnersCashiersResponse;
    }


}
