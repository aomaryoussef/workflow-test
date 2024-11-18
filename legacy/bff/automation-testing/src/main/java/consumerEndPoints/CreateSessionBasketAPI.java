package consumerEndPoints;
import consumerAPIs.consumerPayload.createSessionBasket.CreateSessionBasketBody;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
public class CreateSessionBasketAPI {
    public static Response createSessionBasket(CreateSessionBasketBody payload) {
        Response response = RestAssured.given()
                .contentType(ContentType.JSON)
                .accept(ContentType.JSON)
                .body(payload)
                .when()
                .post(RouteConsumer.baseRUL+ RouteConsumer.createSessionBasketRoute);
        return response;
    }
}
