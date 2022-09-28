const createError = require("http-errors");
require('express-async-errors');
var bcrypt = require('bcryptjs')

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class CommentController {
  static index = async (req, res, next) => {
    if (req.session.user === undefined) {
      res.status(401).json({
        message: 'Unauthorized!'
      })
      return
    }
  
    try {
      const slug = req.query.slug ?? ''
      
      const comments = await prisma.comment.findMany({
        where: {
          dishSlug: String(slug)
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          dishSlug: true,
          user: {
            select: {
              id: true,
              name: true,
              profile: true
            }
          }
        },
        orderBy: {
          id: 'desc'
        }
      })

      res.status(200).json(comments)
    } catch (e) {
      next(createError(e.statusCode, e.message))
      process.exit(1)
    }
  }

  static store = async (req, res, next) => {
    if (req.session.user === undefined) {
      res.status(401).json({
        message: 'Unauthorized!'
      })
      return
    }

    try {
      const { comment, slug } = req.body

      const createComments = await prisma.comment.create({
        data: {
          content: String(comment),
          dishSlug: String(slug),
          userId: String(req.session.user.id)
        }
      })

      res.status(200).json(createComments)
    } catch (e) {
      next(createError(e.statusCode, e.message))
      process.exit(1)
    }
  }  
}

module.exports = CommentController
