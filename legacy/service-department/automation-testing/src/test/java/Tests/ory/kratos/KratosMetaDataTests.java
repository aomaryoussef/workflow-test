package Tests.ory.kratos;

import apis.ory.kratos.kratosEndpoints.KratosMetaDataEndpoints;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.Test;

public class KratosMetaDataTests {
    @Test
    public void GetHttpServerStatus(){
        Response ServerStatusResponse = KratosMetaDataEndpoints.getHttpServerStatus();
        Assert.assertEquals(ServerStatusResponse.statusCode(),200);
    }
    @Test
    public void GetHttpServerandDatabaseStatus(){
        Response DatabaseStatusResponse = KratosMetaDataEndpoints.getHttpDatabaseStatus();
        Assert.assertEquals(DatabaseStatusResponse.statusCode(),200);
    }
    @Test
    public void GetRunningSoftwareVersion(){
        Response SoftwareVersionResponse = KratosMetaDataEndpoints.getRunningSoftwareVersion();
        Assert.assertEquals(SoftwareVersionResponse.statusCode(),200);
    }
}
