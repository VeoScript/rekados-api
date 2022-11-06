const createError = require("http-errors");
require('express-async-errors');
var bcrypt = require('bcryptjs')

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require('jwt-simple')

class ResetPasswordController {
  static forgotPassword = async (req, res, next) => {
    try {
      const { email } = req.body
  
      const foundUser = await prisma.user.findFirst({
        where: {
          email: email
        },
        select: {
          id: true,
          email: true,
          name: true
        }
      })
  
      if (!foundUser) {
        return res.status(400).json({
          message: 'Email not found.'
        })
      }

      const userId = foundUser.id
      const payload = { userId: userId }
      const secret = process.env.JWT_SECRET
      const token = jwt.encode(payload, secret)

      const name = foundUser.name
      const mailMessage = 'To reset your password in Rekados App paste this reset password code'
      const reset_code = String(token)

      res.status(200).json({
        email,
        name,
        mailMessage,
        reset_code,
        message: 'Check your email to get the reset password code!'
      })

    } catch (e) {
      next(createError(e.statusCode, e.message))
      process.exit(1)
    }
  }

  static resetPassword = async (req, res, next) => {
    try {
      const { userId, newpassword } = req.body

      const salt = await bcrypt.genSalt()
      const hashPassword = await bcrypt.hash(newpassword, salt)
  
      const resetPassword = await prisma.user.update({
        where: {
          id: userId
        },
        data: {
          password: hashPassword
        }
      })

      res.status(200).json(resetPassword)
    } catch (e) {
      next(createError(e.statusCode, e.message))
      process.exit(1)
    }
  }
}

module.exports = ResetPasswordController
