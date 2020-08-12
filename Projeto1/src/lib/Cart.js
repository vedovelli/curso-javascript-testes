import Dinero from 'dinero.js';
import find from 'lodash/find';
import remove from 'lodash/remove';

const Money = Dinero;

Money.defaultCurrency = 'BRL';
Money.defaultPrecision = 2;

const calculatePercentageDiscount = (quantity, condition, amount) => {
  if (quantity > condition.above) {
    return amount.percentage(condition.percentage);
  }
  return Money({ amount: 0 });
};

const calculateQuantityDiscount = (quantity, condition, amount) => {
  if (quantity > condition.quantity) {
    const isEven = quantity % 2 === 0;
    return amount.percentage(isEven ? 50 : 40);
  }
  return Money({ amount: 0 });
};

const calculateDiscount = (quantity, conditions, amount) => {
  const list = Array.isArray(conditions) ? conditions : [conditions];

  const [a] = list
    .map(c => {
      if (c.percentage) {
        return calculatePercentageDiscount(quantity, c, amount).getAmount();
      }
      if (c.quantity) {
        return calculateQuantityDiscount(quantity, c, amount).getAmount();
      }
    })
    .sort((a, b) => b - a);
  return Money({ amount: a });
};

export default class Cart {
  items = [];

  getTotal() {
    const total = this.items.reduce(
      (acc, { product: { price }, quantity, condition }) => {
        const amount = Money({ amount: price * quantity });

        let discount = Money({ amount: 0 });
        if (condition) {
          discount = calculateDiscount(quantity, condition, amount);
        }

        return acc.add(amount).subtract(discount);
      },
      Money({ amount: 0 }),
    );

    return {
      amount: total.toUnit(),
      formatted: total.toFormat('$0,0.00'),
    };
  }

  addProduct(item) {
    if (find(this.items, item)) {
      remove(this.items, item);
    }

    this.items.push(item);
  }

  removeProduct(item) {
    remove(this.items, ({ product }) => item === product);
  }

  checkout() {
    return {
      totalAmount: this.getTotal(),
      items: this.items,
    };
  }
}
