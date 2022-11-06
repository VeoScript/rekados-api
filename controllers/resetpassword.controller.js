const createError = require("http-errors");
require('express-async-errors');

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require('jwt-simple')
const emailJS = require('@emailjs/browser')

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
      const message = 'To reset your password in Rekados App paste this reset password code'
      const reset_code = String(token)

      await emailJS.send(
        process.env.EMAILJS_SERVICE_ID,
        process.env.EMAILJS_TEMPLATE_ID,
        { name, email, message, reset_code },
        process.env.EMAILJS_PUBLIC_KEY
      ).then(() => {
        res.status(200).json({
          reset_code,
          message: 'Check your email to get the reset password code!'
        })
      }).catch((error) => {
        console.error(error)
        return res.status(400).json({
          message: String(error)
        })
      })

    } catch (e) {
      next(createError(e.statusCode, e.message))
      process.exit(1)
    }
  }
}

module.exports = ResetPasswordController
