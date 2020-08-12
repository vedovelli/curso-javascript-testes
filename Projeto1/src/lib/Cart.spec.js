import Cart from './Cart';

describe('Shopping cart', () => {
  let cart;
  let product1;
  let product2;

  beforeEach(() => {
    cart = new Cart();

    product1 = {
      title: 'Adidas running shoes men',
      price: 35378,
    };

    product2 = {
      title: 'Adidas running shoes women',
      price: 42236,
    };
  });

  describe('getTotal', () => {
    it('should return 0 when cart is first created', () => {
      expect(cart.getTotal().amount).toEqual(0);
    });

    it('should return product price multiplied by product quantity', () => {
      cart.addProduct({ product: product1, quantity: 2 });
      expect(cart.getTotal().amount).toEqual(707.56);
    });

    it('should return a formatted amount for total', () => {
      cart.addProduct({ product: product1, quantity: 2 });
      cart.addProduct({ product: product1, quantity: 2 });
      expect(cart.getTotal().formatted).toEqual('R$707.56');
    });

    it('should update total when a product is included and then removed', () => {
      cart.addProduct({ product: product1, quantity: 2 });
      cart.removeProduct(product1);
      cart.addProduct({ product: product1, quantity: 1 });
      expect(cart.getTotal().amount).toEqual(353.78);
    });
  });

  describe('checkout', () => {
    it('should return a summary of all products, their quantities and the total amount', () => {
      cart.addProduct({ product: product1, quantity: 2 });
      cart.addProduct({ product: product2, quantity: 10 });
      expect(cart.checkout()).toMatchSnapshot();
    });
  });

  describe('special conditions', () => {
    it('should apply percentage discount', () => {
      const condition = {
        percentage: 30,
        above: 2,
      };

      const item = { product: product1, quantity: 3, condition };

      cart.addProduct(item);

      expect(cart.getTotal().amount).toEqual(742.94);
    });

    it('should not apply discount if condition is not met: percentage', () => {
      const condition = {
        percentage: 30,
        above: 2,
      };

      const item = { product: product1, quantity: 1, condition };

      cart.addProduct(item);

      expect(cart.getTotal().amount).toEqual(353.78);
    });

    it('should apply quantity discount for even quantity', () => {
      const condition = {
        quantity: 2,
      };

      const item = { product: product1, quantity: 4, condition };

      cart.addProduct(item);

      expect(cart.getTotal().amount).toEqual(707.56);
    });

    it('should apply quantity discount for odd quantity', () => {
      const condition = {
        quantity: 2,
      };

      const item = { product: product1, quantity: 5, condition };

      cart.addProduct(item);

      expect(cart.getTotal().amount).toEqual(1061.34);
    });

    it('should not apply discount if condition is not met: quantity', () => {
      const condition = {
        quantity: 2,
      };

      const item = { product: product1, quantity: 1, condition };

      cart.addProduct(item);

      expect(cart.getTotal().amount).toEqual(353.78);
    });

    it('should work as well with a mixed case', () => {
      let condition = {
        quantity: 2,
      };

      cart.addProduct({ product: product2, quantity: 9, condition });

      condition = {
        percentage: 30,
        above: 2,
      };

      cart.addProduct({ product: product1, quantity: 5, condition });

      expect(cart.getTotal().amount).toEqual(3518.97);
    });

    it('should apply the best condition when 2 or more conditions are supplied - first case', () => {
      const condition1 = {
        quantity: 2,
      };
      const condition2 = {
        percentage: 30,
        above: 2,
      };
      cart.addProduct({
        product: product1,
        quantity: 5,
        condition: [condition1, condition2],
      });

      expect(cart.getTotal().amount).toEqual(1061.34);
    });

    it('should apply the best condition when 2 or more conditions are supplied - second case', () => {
      const condition1 = {
        quantity: 2,
      };
      const condition2 = {
        percentage: 80,
        above: 2,
      };
      cart.addProduct({
        product: product1,
        quantity: 5,
        condition: [condition1, condition2],
      });

      expect(cart.getTotal().amount).toEqual(353.78);
    });
  });
});
