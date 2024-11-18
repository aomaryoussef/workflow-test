package apis.routes;

public class Routes {
public static String base_url = "http://localhost:1337";


    // Partner Module
    public static String Post_Partner_url = base_url + "/v1/partners";
    public static String Get_All_Partners_url = base_url + "/v1/partners";
    public static String Get_Partner_by_ID_url = base_url + "/v1/partners/{partnerId}";
    public static String Post_Reset_Password_url = base_url +"/v1/partners/reset-password";
    public static String Get_Partner_Transactions = base_url +"/v1/partners/{partner_id}/transactions";

    //Cashier Module
    public static String Post_Cashier_url = base_url +"/v1/partners/{partner_id}/cashiers";
    public static String Get_All_Cashiers_by_PartnerID_url = base_url +"/v1/partners/{partner_id}/cashiers";
    public static String Patch_User_Profile_url = base_url +"/v1/partners/{partner_id}/user-profiles/{user_profile_id}";

    //Partner users Module
    public static String Get_Partner_Users_url = base_url +"/v1/partner-users";

    //Service Department Module
    public static String Get_Service_Dep_Root = base_url +"/";
    public static String Get_Service_Dep_Version = base_url +"/version";

    //Ory Module

    //Kratos
    //MetaData
    public  static String Kratos_Base_url = "https://admin-kratos.ol.dev.internal.btechlabs.io/admin";
    public static String Get_Kratos_Server_Status = Kratos_Base_url +"/health/alive";
    public static String Get_Kratos_Server_and_Database_Status = Kratos_Base_url +"/health/ready";
    public static String Get_Kratos_Running_Version = Kratos_Base_url +"/version";

    //Keto
    //MetaData
    public static String Keto_Base_url = "https://read-keto.ol.dev.internal.btechlabs.io";
    public static String Get_Keto_Server_Status = Keto_Base_url +"/health/alive";
    public static String Get_Keto_Server_and_Database_Status = Keto_Base_url +"/health/ready";
    public static String Get_Keto_Running_Version = Keto_Base_url +"/version";

    //Oathkeeeper
    //MetaData
    public static String OathKeeper_Base_url = "https://api.ol.dev.internal.btechlabs.io/";
    public static String Get_OathKeeper_Server_Status = OathKeeper_Base_url +"/health/alive";
    public static String Get_OathKeeper_Server_and_Database_Status = OathKeeper_Base_url +"/health/ready";
    public static String Get_OathKeeper_Running_Version = OathKeeper_Base_url +"/version";



}

