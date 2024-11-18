package apis.ory.keto.ketoEndpoints;

import apis.routes.Routes;
import io.restassured.RestAssured;
import io.restassured.response.Response;

public class ketoMetaDataEndpoints {
    public static Response getHttpDatabaseStatus() {
        Response response = RestAssured.given()
                .when()
                .get(Routes.Get_Keto_Server_and_Database_Status);
        return response;
    }
    public static Response getHttpServerStatus() {
        Response response = RestAssured.given()
                .when()
                .get(Routes.Get_Keto_Server_Status);
        return response;
    }
    public static Response getRunningSoftwareVersion() {
        Response response = RestAssured.given()
                .when()
                .get(Routes.Get_Keto_Running_Version);
        return response;
    }
}
