package Tests.ory.oathkeeper;

import apis.serviceDepartment.serviceDepEndpoints.ServiceDepEndpoints;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.Test;
import apis.ory.oathkeeper.oathkeeperEndpoints.oathMetaDataEndpints;

public class OauthMetaDataTests {

    @Test
    public void GetHttpServerStatus(){
        Response ServerStatusResponse = oathMetaDataEndpints.getHttpServerStatus();
        Assert.assertEquals(ServerStatusResponse.statusCode(),200);
    }
    @Test
    public void GetHttpServerandDatabaseStatus(){
        Response DatabaseStatusResponse = oathMetaDataEndpints.getHttpDatabaseStatus();
        Assert.assertEquals(DatabaseStatusResponse.statusCode(),200);
    }
    @Test
    public void GetRunningSoftwareVersion(){
        Response SoftwareVersionResponse = oathMetaDataEndpints.getRunningSoftwareVersion();
        Assert.assertEquals(SoftwareVersionResponse.statusCode(),200);
    }

}
