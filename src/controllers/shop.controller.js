'use strict';
class ShopController {
  demo = async (req, res, next) => {
    return res.status(201).json({
      hello: 'hello',
    });
  };
}

module.exports = new ShopController();
