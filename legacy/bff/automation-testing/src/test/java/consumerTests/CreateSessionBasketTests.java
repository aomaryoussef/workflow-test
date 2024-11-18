package consumerTests;

import consumerAPIs.consumerPayload.createSessionBasket.CreateSessionBasketBody;
import consumerAPIs.consumerPayload.createSessionBasket.DeviceInfo;
import consumerAPIs.consumerPayload.createSessionBasket.Header;
import consumerAPIs.consumerPayload.createSessionBasket.Products;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;
import consumerEndPoints.*;

public class CreateSessionBasketTests {
    Header header;
    DeviceInfo deviceInfo;
    Products products;
    CreateSessionBasketBody createSessionBasketBody;

    @BeforeTest
    public void setupData() {
        header=new Header();
        deviceInfo=new DeviceInfo();
        deviceInfo.setBrand("x");
        deviceInfo.setModel("x");
        deviceInfo.setAppVersion("x");
        deviceInfo.setOsVersion("x");
        products=new Products();
        products.setCategory("furniture");
        products.setCount(1);
        products.setName("iphone");
        products.setPrice(1000000);
        createSessionBasketBody=new CreateSessionBasketBody();

    }
    @Test(priority = 1)
    public void CreatePartner() {

        Response response =CreateSessionBasketAPI.createSessionBasket(createSessionBasketBody);

        System.out.println(createSessionBasketBody);
        Assert.assertEquals(response.statusCode(), 201);
    }

}
