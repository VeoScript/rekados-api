const createError = require("http-errors");
require('express-async-errors');
var bcrypt = require('bcryptjs')

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class UserController {
  static user = async (req, res, next) => {
    if (req.session.user === undefined) {
      res.status(401).json({
        message: 'Unauthorized!'
      })
      return
    }

    try {
      const user = await prisma.user.findFirst({
        where: {
          id: String(req.params.id)
        },
        select: {
          id: true,
          profile: true,
          name: true,
          username: true,
          email: true,
          location: true,
          bio: true,
          dishes: true,
          likes: true
        }
      })
      res.status(200).json(user)
    } catch (e) {
      next(createError(e.statusCode, e.message))
      process.exit(1)
    }
  }

  static changeProfile = async (req, res, next) => {
    if (req.session.user === undefined) {
      res.status(401).json({
        message: 'Unauthorized!'
      })
      return
    }

    try {
      const changeprofile = await prisma.user.update({
        where: {
          id: String(req.params.id)
        },
        data: {
          profile: String(req.body.profileURL)
        }
      })
      res.status(200).json(changeprofile)
    } catch (e) {
      next(createError(e.statusCode, e.message))
      process.exit(1)
    }
  }

  static updateAccount = async (req, res, next) => {
    if (req.session.user === undefined) {
      res.status(401).json({
        message: 'Unauthorized!'
      })
      return
    }

    try {
      const updateAccount = await prisma.user.update({
        where: {
          id: String(req.params.id)
        },
        data: {
          name: String(req.body.name),
          username: String(req.body.username),
          email: String(req.body.email),
          location: String(req.body.location),
          bio: String(req.body.bio)
        }
      })
      res.status(200).json(updateAccount)
    } catch (e) {
      next(createError(e.statusCode, e.message))
      process.exit(1)
    }
  }

  static changePassword = async (req, res, next) => {
    if (req.session.user === undefined) {
      res.status(401).json({
        message: 'Unauthorized!'
      })
      return
    }
    
    try {
      const { oldPassword, newPassword } = req.body
  
      const foundUser = await prisma.user.findMany({
        where: {
          id: String(req.params.id)
        },
        select: {
          id: true,
          password: true
        }
      })
  
      if (!foundUser[0]) {
        return res.status(400).json({
          message: 'You are not logged in!'
        })
      }
      const userHashPassword = foundUser[0].password

      const matchedPassword = await bcrypt.compare(oldPassword, userHashPassword)

      if (!matchedPassword) {
        return res.status(400).json({
          message: 'Old password did not match.'
        })
      }
      
      const updatePassword = await prisma.user.update({
        where: {
          id: String(req.params.id)
        },
        data: {
          password: newPassword
        }
      })

      res.status(200).json(updatePassword)
    } catch (e) {
      next(createError(e.statusCode, e.message))
      process.exit(1)
    }
  }
}

module.exports = UserController
