package Tests.partnerTests;

import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.Test;
import apis.partner.partnerEndpoints.PartnerUsersEndpoints;

import java.util.List;

public class PartnerUsersTests {
    @Test(priority = 8)
    public void GetAllPartnerUsers(){
        Response PaertnerUsersResponse = PartnerUsersEndpoints.GetAllPartnerUsers();
        Assert.assertEquals(PaertnerUsersResponse.statusCode(),200);
        JsonPath PartnerUsersJsonPath = PaertnerUsersResponse.jsonPath();
        Assert.assertTrue(PartnerUsersJsonPath.get("data") instanceof List);
    }
}
