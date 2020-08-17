import Cart from './Cart';

describe('Cart', () => {
  let cart;

  beforeEach(() => {
    cart = new Cart();
  });

  it('should return 0 when getTotal() is executed in a newly created instance', () => {
    expect(cart.getTotal()).toEqual(0);
  });

  it('should multiply quantity and price and receive the total amount', () => {
    const item = {
      product: {
        title: 'Adidas running shoes - men',
        price: 35388, // 353.88 | R$ 383,88
      },
      quantity: 2,
    };

    cart.add(item);

    expect(cart.getTotal()).toEqual(70776);
  });
});
