package Tests.partnerTests;
import apis.partner.partnerPayloads.partnerPayload.*;
import apis.partner.partnerEndpoints.*;
import com.github.javafaker.Faker;
import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.*;
import java.util.Arrays;
import java.util.List;

public class PartnerTests {
    public Partner partnerPayload;
    private  ResetPassword resetPasswordPayload;


    @BeforeTest
    public void setupData() {
        Faker faker = new Faker();
        Admin admin_user_profile = new Admin();
        Location location = new Location();
        BranchDetails branch = new BranchDetails();
        BankAccount bank_account = new BankAccount();

        admin_user_profile.setFirst_name(faker.name().firstName());
        admin_user_profile.setLast_name(faker.name().lastName());
        admin_user_profile.setEmail("demo_user@domain.com");
        admin_user_profile.setPhone_number("01234567890");

        location.setLatitude(faker.address().latitude());
        location.setLongitude(faker.address().longitude());

        branch.setGovernorate("ASSIUT");
        branch.setCity(faker.address().city());
        branch.setArea(faker.address().cityName());
        branch.setStreet(faker.address().streetAddress());
        branch.setLocation(location);

        bank_account.setBank_name("CIB");
        bank_account.setBranch_name(faker.company().name());
        bank_account.setBeneficiary_name(faker.name().fullName());
        bank_account.setIban(faker.business().creditCardNumber());
        bank_account.setSwift_code(faker.business().creditCardNumber());
        bank_account.setAccount_number(faker.number().digits(10));

        partnerPayload = new Partner();
        partnerPayload.setName(faker.commerce().productName());
        partnerPayload.setCommercial_registration_number(faker.number().digits(10));
        partnerPayload.setTax_registration_number(faker.number().digits(9));
        partnerPayload.setCategories(Arrays.asList("ELECTRONICS","FURNITURE"));
        partnerPayload.setAdmin_user_profile(admin_user_profile);
        partnerPayload.setBranch(branch);
        partnerPayload.setBank_account(bank_account);

        resetPasswordPayload = new ResetPassword();
        resetPasswordPayload.setEmail("demo_user@domain.com");
    }

    @Test(priority = 0)
    public void CreatePartner() {
        if (partnerPayload != null) {
            Response response = PartnerEndpoints.createPartner(partnerPayload);
            JsonPath jsonPath = response.jsonPath();
            Assert.assertEquals(response.statusCode(), 201);
            Assert.assertNotNull(jsonPath.get("name"));
            Assert.assertNotNull(jsonPath.get("id"));
            Assert.assertNotNull(jsonPath.get("categories"));
            Assert.assertNotNull(jsonPath.get("status"));
            Assert.assertNotNull(jsonPath.get("tax_registration_number"));
        } else {
            Assert.fail("partnerPayload is null");
        }
    }
   @Test(priority = 2)
   public void CreatePartnerWithSameData() {
       if (partnerPayload != null) {
           Response response = PartnerEndpoints.createPartner(partnerPayload);
           JsonPath jsonPath = response.jsonPath();
           Assert.assertEquals(response.statusCode(),400);
           String message = jsonPath.get("message");
           Assert.assertEquals("Validation Failed", message);
       } else {
           Assert.fail("partnerPayload is null");
       }
   }
    @Test(priority = 1)
    public void GetAllPartners() {
        Response response = PartnerEndpoints.getAllPartners();
        JsonPath jsonPath = response.jsonPath();
        Assert.assertEquals(response.statusCode(), 200);
        Assert.assertNotNull(jsonPath.get("name"));
        Assert.assertNotNull(jsonPath.get("id"));
        Assert.assertNotNull(jsonPath.get("categories"));
        Assert.assertNotNull(jsonPath.get("status"));
        Assert.assertNotNull(jsonPath.get("tax_registration_number"));
    }
    @Test(priority = 3)
    public void GetPartner_by_ID(){
        Response partnersResponse = PartnerEndpoints.getAllPartners();
        JsonPath jsonPath = partnersResponse.jsonPath();
        String partnerID = jsonPath.getString("[0].id");
        Response response = PartnerEndpoints.getPartners_by_ID(partnerID);
        Assert.assertEquals(response.statusCode(), 200);
        Assert.assertNotNull(jsonPath.get("name"));
        Assert.assertNotNull(jsonPath.get("id"));
        Assert.assertNotNull(jsonPath.get("categories"));
        Assert.assertNotNull(jsonPath.get("status"));
        Assert.assertNotNull(jsonPath.get("tax_registration_number"));
    }
    @Test(priority = 4)
    public void ResetPassword(){
       Response response = PartnerEndpoints.ResetPassword(resetPasswordPayload);
       Assert.assertEquals(response.statusCode(), 200);
    }
    @Test(priority = 9)
    public void GetPartnerTransactions(){
        Response partnersResponse = PartnerEndpoints.getAllPartners();
        JsonPath jsonPath = partnersResponse.jsonPath();
        String partnerID = jsonPath.getString("[0].id");
        Response response = PartnerEndpoints.GetPartnerTransactions(partnerID);
        Assert.assertEquals(response.statusCode(),200);
        Assert.assertTrue(jsonPath.get("data") instanceof List);


    }

}

