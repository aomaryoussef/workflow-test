package consumerAPIs.consumerPayload.createSessionBasket;

public class CreateSessionBasketBody {
    Header header;
    Products products;

    public Header getHeader() {
        return header;
    }

    public Products getProducts() {
        return products;
    }

    public void setHeader(Header header) {
        this.header = header;
    }

    public void setProducts(Products products) {
        this.products = products;
    }
}
