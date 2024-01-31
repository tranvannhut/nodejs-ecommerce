'use strict';

const { inventory } = require('../models/inventory.model');

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = 'unknow',
}) => {
  return await inventory.create({
    inventoryShopId: shopId,
    inventoryProductId: productId,
    inventoryStock: stock,
    inventoryLocation: location,
  });
};
module.exports = { insertInventory };
