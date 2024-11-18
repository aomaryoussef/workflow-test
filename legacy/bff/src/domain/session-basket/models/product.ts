export type ProductProps = {
  name: string;
  price: number;
};
export class Product {
  name: string;
  price: number;

  constructor({ name, price }: ProductProps) {
    this.name = name;
    this.price = price;
  }
}
