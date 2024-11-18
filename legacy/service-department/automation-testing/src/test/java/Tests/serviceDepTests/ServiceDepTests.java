package Tests.serviceDepTests;

import apis.serviceDepartment.serviceDepEndpoints.ServiceDepEndpoints;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.Test;

public class ServiceDepTests {
    @Test
    public void GetServiceDepRoot(){
        Response RootResponse = ServiceDepEndpoints.getServiceDepRoot();
        Assert.assertEquals(RootResponse.statusCode(),200);
    }
    @Test
    public void GetServiceDepVersion(){
        Response VersionResponse = ServiceDepEndpoints.getServiceDepVersion();
        Assert.assertEquals(VersionResponse.statusCode(),200);


    }
}
