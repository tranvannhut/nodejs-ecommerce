'use strict'

const shopModel = require('../../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('../key/keyToken.service')
const { createTokenPair } = require('../../auth/authUtils')
const { getIntoData } = require('../../utils')
const RoleShop = {
   SHOP: 'SHOP',
   ADMIN: 'ADMIN',
   WRITER: 'WRITER',
   EDITOR: 'EDITOR'
}

// class handle signUp for shop and create token by JWT + rsa
class AccessService {
   static signUp = async ({ name, email, password }) => {
      try {
         // step1 : check email exists
         const exitsShop = await shopModel.findOne({ email }).lean()
         if (exitsShop) {
            return {
               code: 'XXX',
               messgae: 'Shop already registered!'
            }
         }
         const passwordHash = await bcrypt.hash(password, 10)
         const newShop = await shopModel.create({
            name,
            email,
            password: passwordHash,
            roles: [RoleShop.SHOP]
         })

         // step 2 case accessToken , refressToken
         if (newShop) {
            // step 2.1 create privateKey , publicKey by rsa
            const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
               modulusLength: 4096,
               publicKeyEncoding: {
                  type: 'pkcs1', //pkcs8
                  format: 'pem'
               },
               privateKeyEncoding: {
                  type: 'pkcs1',
                  format: 'pem'
               }
            })
            // step 2.2 save publicKey into DB
            const publicKeyString = await KeyTokenService.createKeyToken({
               userId: newShop._id,
               publicKey
            })
            if (!publicKeyString) {
               return {
                  code: 'XXX',
                  message: 'publicKeyString error'
               }
            }
            // step 2.3 create publicKeyObject and tokens [accessToken , refreshToken]
            const publicKeyObject = crypto.createPublicKey(publicKeyString)
            // create token pair
            const tokens = await createTokenPair(
               { userId: newShop._id, email },
               publicKeyObject,
               privateKey
            )

            return {
               code: 201,
               metadata: {
                  shop: getIntoData({
                     fields: ['_id', 'name', 'email'],
                     object: newShop
                  }),
                  tokens
               }
            }
            // const tokens
         }
         return {
            code: 201,
            metadata: null
         }
      } catch (error) {
         return {
            code: 'XXX',
            message: error.message,
            status: 'error'
         }
      }
   }
}
module.exports = AccessService
