package Tests.cashierTests;

import apis.partner.partnerEndpoints.*;
import apis.partner.partnerPayloads.partnerPayload.*;
import apis.partner.partnerPayloads.cashierPayload.*;
import apis.partner.partnerPayloads.updateUserProfilePayload.*;
import com.github.javafaker.Faker;
import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.*;

import java.util.ArrayList;
import java.util.List;

public class CashierTests {
    Cashier cashierPayload;
    Partner partnerPayload;
    UpdateUserProfile UpdateUserProfilePayload;

    @BeforeTest
    public void setupData() {
        partnerPayload = new Partner();
        cashierPayload = new Cashier();
        UpdateUserProfilePayload = new UpdateUserProfile();
        Faker faker = new Faker();
        cashierPayload.setFirst_name(faker.name().fullName());
        cashierPayload.setLast_name(faker.name().fullName());
        cashierPayload.setPhone_number("01234567890");
        cashierPayload.setEmail(faker.internet().safeEmailAddress());
        cashierPayload.setNational_id(faker.number().digits(14));

        UpdateUserProfilePayload.setState("inactive");
    }

    @Test(priority = 5)
    public void CreateCashier() {
        Response partnersResponse = PartnerEndpoints.getAllPartners();
        JsonPath PartnerJsonPath = partnersResponse.jsonPath();
        String partnerID = PartnerJsonPath.getString("[0].id");
        Response response = CashierEndpoints.createCashier(cashierPayload, partnerID);
        JsonPath CashierJsonPath = response.jsonPath();
        Assert.assertEquals(response.statusCode(), 201);
        Assert.assertNotNull(CashierJsonPath.get("id"));
        Assert.assertNotNull(CashierJsonPath.get("iam_id"));
        Assert.assertNotNull(CashierJsonPath.get("first_name"));
        Assert.assertNotNull(CashierJsonPath.get("last_name"));
        Assert.assertNotNull(CashierJsonPath.get("email"));
        Assert.assertNotNull(CashierJsonPath.get("phone_number"));
        Assert.assertNotNull(CashierJsonPath.get("national_id"));
        Assert.assertEquals(CashierJsonPath.getString("profile_type"), "CASHIER");
        Assert.assertNotNull(CashierJsonPath.get("created_at"));
        Assert.assertNotNull(CashierJsonPath.get("updated_at"));

    }

    @Test(priority = 6)
    public void GetPartnersCashiers() {
        Response partnersResponse = PartnerEndpoints.getAllPartners();
        JsonPath PartnerJsonPath = partnersResponse.jsonPath();
        String partnerID = PartnerJsonPath.getString("[0].id");
        Response CashierResponse = CashierEndpoints.GetPartnersCashiers(cashierPayload, partnerID);
        JsonPath CashierJsonPath = CashierResponse.jsonPath();
        Assert.assertEquals(CashierResponse.statusCode(), 200);
        Assert.assertTrue(CashierJsonPath.get("data") instanceof List);
        System.out.println("");

    }
    @Test(priority = 7)
    public void UpdateUserProfile(){

        Response partnersResponse = PartnerEndpoints.getAllPartners();
        JsonPath jsonPathPartner = partnersResponse.jsonPath();
        String partnerID = jsonPathPartner.getString("[0].id");
        Response cashiersResponse = CashierEndpoints.GetPartnersCashiers(cashierPayload,partnerID);
        JsonPath CashierJsonPath = cashiersResponse.jsonPath();
        String UserProfileID = CashierJsonPath.getString("data[0].id");
        Response UserProfileResponse = UpdateUserProfileEndpoint.UpdateUserProfile(UpdateUserProfilePayload,partnerID,UserProfileID);
        JsonPath UpdateProfileJsonPath = UserProfileResponse.jsonPath();
        Assert.assertEquals(UserProfileResponse.statusCode(), 200);
        Assert.assertTrue(UpdateProfileJsonPath.getBoolean("success"));



    }

}
