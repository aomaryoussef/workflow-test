package apis.ory.oathkeeper.oathkeeperEndpoints;

import apis.routes.Routes;
import io.restassured.RestAssured;
import io.restassured.response.Response;

public class oathMetaDataEndpints {
    public static Response getHttpDatabaseStatus() {
        Response response = RestAssured.given()
                .when()
                .get(Routes.Get_OathKeeper_Server_Status);
        return response;
    }
    public static Response getHttpServerStatus() {
        Response response = RestAssured.given()
                .when()
                .get(Routes.Get_OathKeeper_Server_and_Database_Status);
        return response;
    }
    public static Response getRunningSoftwareVersion() {
        Response response = RestAssured.given()
                .when()
                .get(Routes.Get_OathKeeper_Running_Version);
        return response;
    }
}
