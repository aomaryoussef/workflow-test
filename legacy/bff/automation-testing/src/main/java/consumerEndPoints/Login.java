package consumerEndPoints;

import consumerAPIs.consumerPayload.login.LoginBody;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;

public class Login {
    public static Response login(String baseURL,LoginBody payload) {
        Response response = RestAssured.given()
                .contentType(ContentType.JSON)
                .accept(ContentType.JSON)
                .body(payload)
                .when()
                .post(baseURL);
        return response;
}
}