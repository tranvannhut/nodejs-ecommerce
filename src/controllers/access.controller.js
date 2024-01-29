'use strict'
const AccessService = require('../services/access/access.server')
const { CREATED, SuccessResponse } = require('../core/success.response')
class AccessController {
   handleRefreshToken = async (req, res, next) => {
      new SuccessResponse({
         message: 'Logout successful',
         metadata: await AccessService.handlerRefreshToken(req.body.refreshToken)
      }).send(res)
   }
   logout = async (req, res, next) => {
      new SuccessResponse({
         message: 'Logout successful',
         metadata: await AccessService.logout(req.keyStore)
      }).send(res)
   }
   login = async (req, res, next) => {
      new SuccessResponse({
         metadata: await AccessService.login(req.body)
      }).send(res)
   }
   signUp = async (req, res, next) => {
      try {
         // return res.status(201).json(await AccessService.signUp(req.body));
         new CREATED({
            message: 'Create ok!',
            metadata: await AccessService.signUp(req.body),
            options: {
               limit: 5
            }
         }).send(res)
      } catch (error) {
         next(error)
      }
   }
}

module.exports = new AccessController()
