package apis.serviceDepartment.serviceDepEndpoints;

import apis.routes.Routes;
import io.restassured.RestAssured;
import io.restassured.response.Response;

public class ServiceDepEndpoints {
    public static Response getServiceDepRoot() {
        Response getServiceDepRootResponse = RestAssured.given()
                .when()
                .get(Routes.Get_Service_Dep_Root);
        return getServiceDepRootResponse;
    }
    public static Response getServiceDepVersion(){
        Response getServiceDepVersionResponse = RestAssured.given()
                .when()
                .get(Routes.Get_Service_Dep_Version);
        return getServiceDepVersionResponse;
    }

}
