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
          bio: true
        }
      })
      res.status(200).json(user)
    } catch (e) {
      next(createError(e.statusCode, e.message))
      process.exit(1)
    }
  }
}

module.exports = UserController
