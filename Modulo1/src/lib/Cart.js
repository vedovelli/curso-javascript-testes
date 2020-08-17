export default class Cart {
  items = [];

  add(item) {
    this.items.push(item);
  }

  getTotal() {
    return this.items.reduce((acc, item) => {
      return acc + item.quantity * item.product.price;
    }, 0);
  }
}
