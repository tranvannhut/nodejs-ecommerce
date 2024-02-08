'use strict';
const { NotFoundError } = require('../../core/error.response');
/**
 * Key features : Cart Service
 * - add product to cart [user]
 * - reduce product quantity by one [User]
 * - increate product quantity by one [User]
 * - get cart [User]
 * - delete cart [User]
 * - delete cart [User]
 */
const { cart } = require('../../models/cart.model');
const { getProductById } = require('../../repositories/product.repo');
class CartService {
  static async addUserCart({ userId, product }) {
    const query = { cartUserId: userId, cartStatus: 'active' },
      updateOrInsert = {
        $addToSet: {
          cartProducts: product,
        },
      },
      options = { upsert: true, new: true };
    return await cart.findOneAndUpdate(query, updateOrInsert, options);
  }
  static async updateUserCartQuantity({ userId, product }) {
    const { quantity, productId } = product;
    const query = {
        cartUserId: userId,
        'cartProducts.productId': productId,
        cartStatus: 'active',
      },
      updateSet = {
        $inc: {
          'cartProducts.$.quantity': quantity,
        },
      },
      options = { upsert: true, new: true };
    return await cart.findOneAndUpdate(query, updateSet, options);
  }
  static async addToCart({ userId, product = {} }) {
    // check cart exist
    const userCart = await cart.findOne({
      cartUserId: userId,
      cartStatus: 'active',
    });
    if (!userCart) {
      // add new user to cart
      return await CartService.addUserCart({ userId, product });
    }
    // if cart exist but not contain product
    if (!userCart.cartProducts.length) {
      userCart.cartProducts = [product];
      return userCart.save();
    }
    // product in cart exist => if update amount quantity => update quantity
    return await CartService.updateUserCartQuantity({ userId, product });
  }

  /**
   * update cart
   * shopOrderIds :
   *   [{
   *        shopId,
   *        itemProducts : [
   *            {quantity, price, productId, shopId, oldQuantity }
   *        ],
   *        version
   *    }]
   */
  static async addToCartV2({ userId, shopOrderIds }) {
    console.log(
      '🚀 ~ CartService ~ addToCartV2 ~ userId, shopOrderIds:',
      userId,
      shopOrderIds,
    );
    const { productId, quantity, oldQuantity } =
      shopOrderIds[0]?.itemProducts[0];
    console.log(
      '🚀 ~ CartService ~ addToCartV2 ~  productId, quantity, oldQuantity:',
      productId,
      quantity,
      oldQuantity,
    );
    // check product
    const productFound = await getProductById(productId);
    console.log('🚀 ~ CartService ~ addToCartV2 ~ productFound:', productFound);
    if (!productFound) throw new NotFoundError();
    // compare
    console.log(
      '🚀 ~ CartService ~ addToCartV2 ~ shopOrderIds[0]?.itemProducts[0]: ',
      shopOrderIds[0]?.itemProducts[0],
      '&&',
      productFound.productShop.toString(),
    );
    if (
      productFound.productShop.toString() !==
      shopOrderIds[0]?.itemProducts[0].shopId
    )
      throw new NotFoundError('Product do not belong to the shop');
    if (quantity === 0) {
      //delete cart
      CartService.deleteUserCart({ userId, productId });
    }
    return await CartService.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - oldQuantity,
      },
    });
  }
  static async deleteUserCart({ userId, productId }) {
    const query = { cartUserId: userId, cartStatus: 'active' },
      updateSet = {
        $pull: {
          cartProducts: {
            productId,
          },
        },
      };
    const deleteCart = await cart.updateOne(query, updateSet);
    return deleteCart;
  }
  static async getListUserCart({ userId }) {
    return await cart.findOne({ cartUserId: userId });
  }
}
module.exports = CartService;
