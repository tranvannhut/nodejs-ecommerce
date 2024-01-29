'use strict'

const shopModel = require('../../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('../key/keyToken.service')
const { createTokenPair, verifyJWT } = require('../../auth/authUtils')
const { getIntoData } = require('../../utils')
const { BadRequestError, AuthFailureError, NotFoundError } = require('../../core/error.response')
const { findByEmail } = require('../shop/shop.server')
const keytokenModel = require('../../models/keytoken.model')
const RoleShop = {
   SHOP: 'SHOP',
   ADMIN: 'ADMIN',
   WRITER: 'WRITER',
   EDITOR: 'EDITOR'
}

// class handle signUp for shop and create token by JWT + rsa
class AccessService {
   /*  
    1. Check email valid in db
    2. Brypt and check match password
    3. Create accessToken and refreshToken and save
    4. Generate token
    5. Get data return login
  */
   static login = async ({ email, password, refreshToken = null }) => {
      // 1.
      const existShop = await findByEmail({ email })
      if (!existShop) throw new BadRequestError('Shop not registered')

      // 2.
      const matchPassword = bcrypt.compare(password, existShop.password)
      if (!matchPassword) throw new AuthFailureError('Authentication error')

      //3.
      // create privateKey, publicKey
      const privateKey = crypto.randomBytes(64).toString('hex')
      const publicKey = crypto.randomBytes(64).toString('hex')

      //4. - generate tokens
      const tokens = await createTokenPair({ userId: existShop._id, email }, publicKey, privateKey)
      await KeyTokenService.createKeyToken({
         userId: existShop._id,
         refreshToken: tokens.refreshToken,
         privateKey,
         publicKey
      })
      return {
         shop: getIntoData({
            fields: ['_id', 'name', 'email'],
            object: existShop
         }),
         tokens
      }
   }
   static signUp = async ({ name, email, password }) => {
      // try {
      // step1 : check email exists
      const exitsShop = await shopModel.findOne({ email }).lean()
      // if exist throw error
      if (exitsShop) {
         throw new BadRequestError('Error: Shop already registered!')
         // return {
         //   code: "XXX",
         //   messgae: "Shop already registered!",
         // };
      }
      // hash password by brypt
      const passwordHash = await bcrypt.hash(password, 10)
      const newShop = await shopModel.create({
         name,
         email,
         password: passwordHash,
         roles: [RoleShop.SHOP]
      })

      // step 2 case accessToken , refressToken
      if (newShop) {
         // // step 2.1 create privateKey , publicKey
         const publicKey = crypto.randomBytes(64).toString('hex')
         const privateKey = crypto.randomBytes(64).toString('hex')
         // step 2.2 save publicKey into DB
         const keyStore = await KeyTokenService.createKeyToken({
            userId: newShop._id,
            publicKey,
            privateKey
         })
         if (!keyStore) {
            return {
               code: 'XXxxX',
               message: 'keyStore error'
            }
         }
         // create token pair
         const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)

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
      // } catch (error) {
      //   return {
      //     code: "XXXxxxx",
      //     message: error.message,
      //     status: "error",
      //   };
      // }
   }

   static logout = async (keyStore) => {
      const delKey = await KeyTokenService.deleteTokenById(keyStore._id)
      return delKey
   }

   static handlerRefreshToken = async (refreshToken) => {
      const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)
      if (foundToken) {
         const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey)
         // delete all token in keyStore with userid
         await KeyTokenService.deleteTokenKeyByUserId(userId)
         throw new ForbiddenError('Something wrong happend!! Please login')
         // throw new NotFoundError("Not found refreshToken");
      }
      // if refreshToken never used
      const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
      if (!holderToken) throw new AuthFailureError('Shop not registered!')
      // verifyToken
      const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey)
      // check UserId
      const foundShop = await findByEmail({ email })
      if (!foundShop) throw new AuthFailureError('Shop not registered!')

      // create one token new
      const tokens = await createTokenPair(
         { userId, email },
         holderToken.publicKey,
         holderToken.privateKey
      )
      // update token
      await holderToken.updateOne({
         $set: {
            refreshToken: tokens.refreshToken
         },
         $addToSet: {
            refreshTokensUsed: refreshToken
         }
      })
      return {
         user: { userId, email },
         tokens
      }
   }
}
module.exports = AccessService
