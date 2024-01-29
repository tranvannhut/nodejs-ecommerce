'use strict'

const { findApiKeyById } = require('../services/auth/auth-apikey.service')

const HEADER = {
   API_KEY: 'x-api-key',
   AUTHORIZATION: 'authorization'
}
const apiKey = async (req, res, next) => {
   try {
      const key = req.headers[HEADER.API_KEY]?.toString()
      if (!key) {
         // case header not contain api => throw forbidden
         return res.status(403).json({
            message: 'Forbidden error!!'
         })
      }

      // check apiKey valid
      const apiKey = await findApiKeyById(key)
      if (!apiKey) {
         // case header not contain api => throw forbidden
         return res.status(403).json({
            message: 'Forbidden error!!'
         })
      }
      req.apiKey = apiKey
      return next()
   } catch (error) {}
}

const permission = (permission) => {
   return (req, res, next) => {
      if (!req?.apiKey.permissions) {
         return res.status(403).json({
            message: 'Permission denied!'
         })
      }
      const validPermission = req?.apiKey.permissions.includes(permission)
      if (!validPermission) {
         return res.status(403).json({
            message: 'Permission denied!'
         })
      }
      return next()
   }
}

// const asyncHandler = (fn) => {
//   return (req, res, next) => {
//     fn(req, res, next).catch(next);
//   };
// };

module.exports = {
   apiKey,
   permission
   // asyncHandler,
}
