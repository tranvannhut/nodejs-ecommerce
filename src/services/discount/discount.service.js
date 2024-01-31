'use strict';
const discount = require('../../models/discount.model');
const { BadRequestError, NotFoundError } = require('../../core/error.response');
const { convertToObjectIdMongo } = require('../../utils');
const { findAllProduct } = require('../product.service.advance');
const {
  findAllDiscountCodeUnSelect,
  checkDiscountExist,
  deleteDiscount,
} = require('../../repositories/discount.repo');

/**
 * 1. Generate discount code [Shop | Admin]
 * 2. Get discount amount [User]
 * 3. Get all discount codes [User | Shop]
 * 4. Verify discount code [User]
 * 5. Delete discount code [Admin | Shop]
 * 6. Cancel discount
 */

class DiscountService {
  static generateDiscount = async (payload) => {
    const {
      code,
      name,
      description,
      type,
      startDate,
      endDate,
      discountMaxUses,
      discountUsesCount,
      discountUsersUsed,
      discountValue,
      maxUsesPerUser,
      minOrderValue,
      shopId,
      discountIsActive,
      applyTo,
      listProduct,
    } = payload;
    if (new Date() < new Date(startDate) || new Date() > new Date(endDate)) {
      throw new BadRequestError('Discount code has expired');
    }

    // create index for discount code
    const foundDiscount = await discount
      .findOne({
        discountCode: code,
        discountShopId: convertToObjectIdMongo(shopId),
      })
      .lean();
    if (foundDiscount && foundDiscount.discountIsActive) {
      throw new BadRequestError('Discount exist');
    }
    const newDiscount = discount.create({
      discountCode: code,
      discountName: name,
      discountDescription: description,
      discountType: type,
      discountStartDate: new Date(startDate),
      discountEndDate: new Date(endDate),
      discountMaxUses,
      discountUsesCount,
      discountUsersUsed,
      discountValue,
      discountMaxUsesPerUser: maxUsesPerUser,
      discountMinOrderValue: minOrderValue || 0,
      discountShopId: shopId,
      discountIsActive,
      discountAppliesTo: applyTo,
      discountProductIds: applyTo === 'all' ? [] : listProduct,
    });
    return newDiscount;
  };
  /**
   * Get all discount codes available with products
   * @param {*} param0
   */
  static getAllDiscountCodeWithProduct = async ({
    shopId,
    code,
    userId,
    limit,
    page,
  }) => {
    const foundDiscount = await discount
      .findOne({
        discountCode: code,
        discountShopId: convertToObjectIdMongo(shopId),
      })
      .lean();
    if (!foundDiscount || !foundDiscount.discountIsActive) {
      throw new NotFoundError('Discount not exits');
    }
    const { discountAppliesTo, discountProductIds } = foundDiscount;
    let listProduct;
    if (discountAppliesTo === 'all') {
      // get all product
      listProduct = await findAllProduct({
        filter: {
          productShop: convertToObjectIdMongo(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['productName'],
      });
    } else if (discountAppliesTo === 'specific') {
      listProduct = await findAllProduct({
        filter: {
          _id: { $in: discountProductIds },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['productName'],
      });
    }
    return listProduct;
  };
  static async getAllDiscountCodeByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodeUnSelect({
      limit: +limit,
      page: +page,
      filter: {
        discountShopId: convertToObjectIdMongo(shopId),
        discountIsActive: true,
      },
      unselect: ['__v', 'discountShopId'],
      model: discount,
    });
    return discounts;
  }
  static async getDiscountAmount({ code, userId, shopId, products }) {
    const existDiscount = await checkDiscountExist({
      model: discount,
      filter: {
        discountCode: code,
        discountShopId: convertToObjectIdMongo(shopId),
      },
    });
    if (!existDiscount) throw new NotFoundError(`Discount doesn't exist`);
    const {
      discountIsActive,
      discountMinOrderValue,
      discountMaxUsesPerUser,
      discountMaxUses,
      discountStartDate,
      discountEndDate,
      discountType,
      discountUsersUsed,
      discountValue,
    } = existDiscount;
    if (!discountIsActive) throw new NotFoundError(`Discount exprired`);
    if (!discountMaxUses) throw new NotFoundError(`Discount are out off`);
    if (
      new Date() < new Date(discountStartDate) ||
      new Date() > new Date(discountEndDate)
    )
      throw new NotFoundError(`Discount code has expried`);
    let totalOrder = 0;
    if (discountMinOrderValue > 0) {
      // get total
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);
      if (totalOrder < discountMinOrderValue) {
        throw new NotFoundError(
          `discount requires a minium order value of ${discountMinOrderValue}`,
        );
      }
    }
    if (discountMaxUsesPerUser > 0) {
      const userUsedDiscount = discountUsersUsed.find(
        (user) => user.userId === userId,
      );
      if (userUsedDiscount) {
        throw new BadRequestError('User has out of use discount');
      }
    }
    // check discount with type ='fixed_amount' || = 'percentage' ...
    const amount =
      discountType === 'fixed_amount'
        ? discountValue
        : totalOrder * (discountValue / 100);
    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }
  static deleteDiscount = async ({ shopId, code }) => {
    const deletedDiscount = await deleteDiscount({
      model: discount,
      filter: {
        discountShopId: convertToObjectIdMongo(shopId),
        discountCode: code,
      },
    });
    return deletedDiscount;
  };
  static cancelDiscount = async ({ code, shopId, userId }) => {
    const foundDiscount = await checkDiscountExist({
      model: discount,
      filter: {
        discountCode: code,
        discountShopId: convertToObjectIdMongo(shopId),
      },
    });
    if (!foundDiscount) throw new NotFoundError(`discount doesn't exist`);
    const result = await discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discountUsersUsed: userId,
      },
      $inc: {
        discountMaxUses: 1,
        discountUsersUsed: -1,
      },
    });
    return result;
  };
}

module.exports = DiscountService;
