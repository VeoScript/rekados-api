const createError = require("http-errors");
require('express-async-errors');

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
}

module.exports = UserController
