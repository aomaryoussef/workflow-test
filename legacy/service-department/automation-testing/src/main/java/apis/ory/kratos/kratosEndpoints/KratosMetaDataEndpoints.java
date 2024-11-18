package apis.ory.kratos.kratosEndpoints;

import apis.routes.Routes;
import io.restassured.RestAssured;
import io.restassured.response.Response;

public class KratosMetaDataEndpoints {
    public static Response getHttpDatabaseStatus() {
        Response response = RestAssured.given()
                .when()
                .get(Routes.Get_Kratos_Server_and_Database_Status);
        return response;
    }
    public static Response getHttpServerStatus() {
        Response response = RestAssured.given()
                .when()
                .get(Routes.Get_Kratos_Server_Status);
        return response;
    }
    public static Response getRunningSoftwareVersion() {
        Response response = RestAssured.given()
                .when()
                .get(Routes.Get_Kratos_Running_Version);
        return response;
    }
}
