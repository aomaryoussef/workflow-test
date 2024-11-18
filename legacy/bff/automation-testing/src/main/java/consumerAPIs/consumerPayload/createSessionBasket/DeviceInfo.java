package consumerAPIs.consumerPayload.createSessionBasket;
public class DeviceInfo {
    private String brand;
    private String model;
    private String app_version;
    private String os_version;
    public String getBrand() {
        return brand;
    }

    public String getModel() {
        return model;
    }

    public String getAppVersion() {
        return app_version;
    }

    public String getOsVersion() {
        return os_version;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public void setAppVersion(String app_version) {
        this.app_version = app_version;
    }

    public void setOsVersion(String os_version) {
        this.os_version = os_version;
    }



}
