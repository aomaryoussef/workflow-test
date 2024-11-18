package consumerEndPoints;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;

public class CreateLoginFlow {
    public static Response createLoginFlow() {
        Response response = RestAssured.given()
                .contentType(ContentType.JSON)
                .accept(ContentType.JSON)
                .when()
                .get(RouteConsumer.KratosBaseLine+ RouteConsumer.createLoginRoute);
        return response;
    }
}
