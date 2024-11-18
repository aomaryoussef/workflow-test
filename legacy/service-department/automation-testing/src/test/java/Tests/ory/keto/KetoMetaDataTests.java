package Tests.ory.keto;
import apis.ory.keto.ketoEndpoints.ketoMetaDataEndpoints;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.Test;

public class KetoMetaDataTests {

    @Test
    public void GetHttpServerStatus(){
        Response ServerStatusResponse = ketoMetaDataEndpoints.getHttpServerStatus();
        Assert.assertEquals(ServerStatusResponse.statusCode(),200);
    }
    @Test
    public void GetHttpServerandDatabaseStatus(){
        Response DatabaseStatusResponse = ketoMetaDataEndpoints.getHttpDatabaseStatus();
        Assert.assertEquals(DatabaseStatusResponse.statusCode(),200);
    }
    @Test
    public void GetRunningSoftwareVersion(){
        Response SoftwareVersionResponse = ketoMetaDataEndpoints.getRunningSoftwareVersion();
        Assert.assertEquals(SoftwareVersionResponse.statusCode(),200);
    }
}
