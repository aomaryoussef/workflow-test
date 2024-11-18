package consumerAPIs.consumerPayload.login;
public class LoginBody {
    String identifier;
    String password;
    String method;
    public String getIdentifier() {
        return identifier;
    }
    public String getPassword() {
        return password;
    }
    public String getMethod() {
        return method;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public void setMethod(String method) {
        this.method = method;
    }
    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }
}
