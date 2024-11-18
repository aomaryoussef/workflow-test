package consumerTests;

import com.fasterxml.jackson.core.JsonProcessingException;
import consumerAPIs.consumerPayload.login.LoginBody;
import consumerEndPoints.CreateLoginFlow;
import consumerEndPoints.Login;
import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

public class CreateLoginFlowTests {

    LoginBody loginBody;
   static String loginURL;
    @BeforeTest
    public void setupData() throws JsonProcessingException {
        loginBody =new LoginBody();
        loginBody.setIdentifier("+201098488223");
        loginBody.setPassword ("123456");
        loginBody.setMethod("password");
        Response response = CreateLoginFlow.createLoginFlow();
        JsonPath jsonPath = response.jsonPath();
        loginURL=jsonPath.get("ui.action");

    }

    @Test(priority = 1)
    public void CreateLoginFlowAPI() {

        Response response = Login.login(loginURL,loginBody);
        System.out.println("LoginRsponse:" + response.body().asString());
        Assert.assertEquals(response.statusCode(), 200);


    }

}
