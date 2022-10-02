const createError = require("http-errors");
require('express-async-errors');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class DishController {
  static index = async (req, res, next) => {
    try {
      const limit = 5
      const cursor = req.query.cursor ?? ''
      const cursorObj = cursor === '' ? undefined : { id: String(cursor) }

      const dishes = await prisma.dish.findMany({
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
        dishes,
        nextId:  dishes.length === limit ? dishes[limit - 1].id : undefined
      })
    } catch (e) {
      next(createError(e.statusCode, e.message))
      process.exit(1)
    }
  }

  static show = async (req, res, next) => {
    if (req.session.user === undefined) {
      res.status(401).json({
        message: 'Unauthorized!'
      })
      return
    }

    try {
      const { slug } = req.body

      const dish = await prisma.dish.findFirst({
        where: {
          slug: String(slug)
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
          author: {
            select: {
              id: true,
              name: true
            }
          }
        }
      })
      res.status(200).json(dish)
    } catch (error) {
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
      const { slug, image, title, category, location, description, youtube, authorId } = req.body
      
      const createDish = await prisma.dish.create({
        data: {
          slug: String(slug),
          image: String(image),
          title: String(title),
          category: String(category),
          location: String(location),
          description: String(description),
          youtube: String(youtube),
          authorId: String(authorId)
        }
      })

      res.status(200).json(createDish)
    } catch (e) {
      next(createError(e.statusCode, e.message))
      process.exit(1)
    }
  }

  static storeIngredients = async (req, res, next) => {
    if (req.session.user === undefined) {
      res.status(401).json({
        message: 'Unauthorized!'
      })
      return
    }

    try {
      const { ingredient, slug } = req.body

      const ingredients = await prisma.ingredient.createMany({
        data: {
          name: String(ingredient),
          dishSlug: String(slug)
        }
      })

      res.status(200).json(ingredients)
    } catch (e) {
      next(createError(e.statusCode, e.message))
      process.exit(1)
    }
  }

  static storeProcedures = async (req, res, next) => {
    if (req.session.user === undefined) {
      res.status(401).json({
        message: 'Unauthorized!'
      })
      return
    }

    try {
      const { procedure, slug } = req.body

      const procedures = await prisma.procedure.createMany({
        data: {
          details: String(procedure),
          dishSlug: String(slug)
        }
      })

      res.status(200).json(procedures)
    } catch (e) {
      next(createError(e.statusCode, e.message))
      process.exit(1)
    }
  }
}

module.exports = DishController
