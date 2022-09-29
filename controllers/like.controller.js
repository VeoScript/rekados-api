const createError = require("http-errors");
require('express-async-errors');

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class LikeController {
  static like = async (req, res, next) => {
    if (req.session.user === undefined) {
      res.status(401).json({
        message: 'Unauthorized!'
      })
      return
    }

    try {
      const slug = req.query.slug ?? ''

      const onLike = await prisma.like.create({
        data: {
          dishSlug: String(slug),
          userId: String(req.session.user.id)
        }
      })

      res.status(200).json(onLike)
    } catch (e) {
      next(createError(e.statusCode, e.message))
      process.exit(1)
    }
  }

  static unlike = async (req, res, next) => {
    if (req.session.user === undefined) {
      res.status(401).json({
        message: 'Unauthorized!'
      })
      return
    }

    try {
      const slug = req.query.slug ?? ''

      const onUnlike = await prisma.like.deleteMany({
        where: {
          dishSlug: String(slug),
          userId: String(req.session.user.id)
        }
      })

      res.status(200).json(onUnlike)
    } catch (e) {
      next(createError(e.statusCode, e.message))
      process.exit(1)
    }
  }  
}

module.exports = LikeController
