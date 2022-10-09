const createError = require("http-errors");
require('express-async-errors');

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class SaveDishController {
  static index = async (req, res, next) => {
    if (req.session.user === undefined) {
      res.status(401).json({
        message: 'Unauthorized!'
      })
      return
    }

    try {
      const limit = 5
      const cursor = req.query.cursor ?? ''
      const cursorObj = cursor === '' ? undefined : { id: String(cursor) }

      const saveDish = await prisma.dish.findMany({
        where: {
          likes: {
            some: {
              userId: String(req.session.user.id)
            }
          }
        },
        select: {
          id: true,
          slug: true,
          image: true,
          title: true,
          category: true,
          location: true,
          description: true,
          youtube: true,
          createdAt: true,
          updatedAt: true,
          ingredients: {
            select: {
              id: true,
              name: true,
              dishSlug: true
            }
          },
          procedures: {
            select: {
              id: true,
              details: true,
              dishSlug: true
            }
          },
          likes: {
            select: {
              id: true,
              dishSlug: true,
              userId: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  profile: true,
                  username: true
                }
              }
            }
          },
          comments: {
            select: {
              id: true,
              content: true,
              dishSlug: true,
              createdAt: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  profile: true,
                  username: true
                }
              }
            }
          },
          author: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: limit,
        cursor: cursorObj,
        skip: cursor === '' ? 0 : 1
      })

      res.status(200).json({
        saveDish,
        nextId:  saveDish.length === limit ? saveDish[limit - 1].id : undefined
      })
    } catch (e) {
      next(createError(e.statusCode, e.message))
      process.exit(1)
    }
  }
}

module.exports = SaveDishController
