package consumerAPIs.consumerPayload.createSessionBasket;

public class Products {
    String name;
    int count;
    int price;
    String category;

    public String getName() {
        return name;
    }

    public void setName(String productName) {
        this.name = productName;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int counter) {
        this.count = counter;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int productPrice) {
        this.price = productPrice;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String catg) {
        this.category = catg;
    }
}
