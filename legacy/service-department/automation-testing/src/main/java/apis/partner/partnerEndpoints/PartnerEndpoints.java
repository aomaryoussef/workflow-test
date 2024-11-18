package apis.partner.partnerEndpoints;
import apis.partner.partnerPayloads.partnerPayload.*;
import apis.routes.Routes;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;


public class PartnerEndpoints {
    public static Response createPartner(Partner payload) {
        Response CreatePartnerResponse = RestAssured.given()
                .contentType(ContentType.JSON)
                .accept(ContentType.JSON)
                .body(payload)
                .when()
                .post(Routes.Post_Partner_url);
        return CreatePartnerResponse;
    }

    public static Response getAllPartners() {
        Response getAllPartnersResponse = RestAssured.given()
                .when()
                .get(Routes.Get_All_Partners_url);
        return getAllPartnersResponse;
    }

    public static Response getPartners_by_ID(String partnerID) {
        Response getPartners_by_IDResponse = RestAssured.given()
                .pathParam("partnerId", partnerID)
                .when()
                .get(Routes.Get_Partner_by_ID_url);
        return getPartners_by_IDResponse;
    }
    public static Response ResetPassword(ResetPassword payload){
        Response ResetPasswordResponse = RestAssured.given()
                .contentType(ContentType.JSON)
                .accept(ContentType.JSON)
                .body(payload)
                .when()
                .post(Routes.Post_Reset_Password_url);
        return ResetPasswordResponse;
    }
    public static Response GetPartnerTransactions(String partnerID){
        Response PartnerTransactionsResponse = RestAssured.given()
                .pathParam("partner_id",partnerID)
                .when()
                .get(Routes.Get_Partner_Transactions);
        return PartnerTransactionsResponse;
    }

}