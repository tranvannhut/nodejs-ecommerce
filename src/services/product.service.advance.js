'use strict';
const { BadRequestError, NotFoundError } = require('../core/error.response');
const {
  product,
  clothing,
  electronic,
  furniture,
} = require('../models/product.model');
const productType = require('../constants');
const {
  getAllDraftForShop,
  updatePublishProductByShop,
  getAllPublishedForShop,
  updateUnPublishProductByShop,
  searchProductsByUser,
  findAllProduct,
  findProductById,
  updateProductById,
} = require('../repositories/product.repo');
const {
  removeObjectNullOrUndefined,
  updateNestedObjectParse,
} = require('../utils');
const { insertInventory } = require('../repositories/inventory.repo');
// define Factory class to create
class ProductFactory {
  static productRegistry = {}; // key -class
  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }
  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid Product Types ${type}`);
    return new productClass(payload).createProduct();
  }
  static async updateProduct(type, productId, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid Product Types ${type}`);
    return new productClass(payload).updateProduct(productId);
  }
  // query product
  static async getAllDraftForShop({ productShop, limit = 50, skip = 0 }) {
    const query = { productShop, isDraft: true };
    return await getAllDraftForShop({ query, limit, skip });
  }
  static async getAllPublishForShop({ productShop, limit = 50, skip = 0 }) {
    const query = { productShop, isPublished: true };
    return await getAllPublishedForShop({ query, limit, skip });
  }
  static async getListProductByUser({ keySearch }) {
    return await searchProductsByUser({ keySearch });
  }
  static async findAllProduct({
    filter = {
      isPublished: true,
    },
    sort = 'ctime',
    limit = 50,
    page = 1,
    select,
  }) {
    return await findAllProduct({
      filter,
      sort,
      limit,
      page,
      select: ['productName', 'productPrice', 'productThumb', 'productShop'],
    });
  }
  static async findProductById({ productID, unSelect }) {
    return await findProductById({ productID, unSelect: ['__v'] });
  }
  // put method update product publish
  static async updatePublishProduct({ productId, productShop }) {
    return await updatePublishProductByShop({ productId, productShop });
  }
  // put method update product uPpublish
  static async updateUnPublishProduct({ productId, productShop }) {
    return await updateUnPublishProductByShop({ productId, productShop });
  }
  //
}

class Product {
  constructor({
    productName,
    productThumb,
    productDescription,
    productPrice,
    productQuantity,
    productType,
    productShop,
    productAttributes,
  }) {
    this.productName = productName;
    this.productThumb = productThumb;
    this.productDescription = productDescription;
    this.productPrice = productPrice;
    this.productQuantity = productQuantity;
    this.productType = productType;
    this.productShop = productShop;
    this.productAttributes = productAttributes;
  }
  // create new product
  async createProduct(productId) {
    // return await product.create({ ...this, _id: productId });
    const newProduct = await product.create({ ...this, _id: productId });
    if (newProduct) {
      // add productStock in inventory collection
      // productId,
      // shopId,
      // stock,
      // location = 'unknow'
      await insertInventory({
        productId: newProduct._id,
        shopId: this.productShop,
        stock: this.productQuantity,
      });
    }
    return newProduct;
  }
  async updateProduct(productId, bodyUpdate) {
    return await updateProductById({ productId, bodyUpdate, model: product });
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.productAttributes,
      productShop: this.productShop,
    });
    if (!newClothing) throw new BadRequestError('create new clothing error');

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError('create new product error');

    return newProduct;
  }
  async updateProduct(productId) {
    // return await updateProductById({ productId, bodyUpdate, model: product });
    // 1. remove attr has null or undefined
    const objectParams = removeObjectNullOrUndefined(this);
    // 2. check
    if (objectParams.productAttributes) {
      // update child
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParse(objectParams.productAttributes),
        model: clothing,
      });
      // await updateProductById({ productId, objectParams, model: clothing });
    }
    const updateClothing = await super.updateProduct(
      productId,
      updateNestedObjectParse(objectParams),
    );
    return updateClothing;
  }
}

class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.productAttributes,
      productShop: this.productShop,
    });
    if (!newElectronic) throw new BadRequestError('create new clothing error');

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError('create new product error');

    return newProduct;
  }
}
class Furniture extends Product {
  async createProduct() {
    const newFuriture = await furniture.create({
      ...this.productAttributes,
      productShop: this.productShop,
    });
    if (!newFuriture) throw new BadRequestError('create new clothing error');

    const newProduct = await super.createProduct(newFuriture._id);
    if (!newProduct) throw new BadRequestError('create new product error');

    return newProduct;
  }
  async updateProduct(productId) {
    // return await updateProductById({ productId, bodyUpdate, model: product });
    // 1. remove attr has null or undefined
    const objectParams = this;
    // 2. check
    if (objectParams.productAttributes) {
      // update child
      await updateProductById({ productId, objectParams, model: furniture });
    }
    const updateClothing = await super.updateProduct(productId, objectParams);
    return updateClothing;
  }
}
// register ProductType
ProductFactory.registerProductType(productType.Electronics, Electronics);
ProductFactory.registerProductType(productType.Clothing, Clothing);
ProductFactory.registerProductType(productType.Furniture, Furniture);
module.exports = ProductFactory;
