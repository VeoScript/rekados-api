const createError = require("http-errors");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class DishController {
  static index = async (req, res, next) => {
    if (req.session.user === undefined) {
      res.status(401).json({
        message: 'Unauthorized!'
      })
      return
    }

    try {      
      const dishes = await prisma.dish.findMany({
        select: {
          id: true,
          image: true,
          title: true,
          category: true,
          location: true,
          description: true,
          youtube: true,
          ingredients: {
            select: {
              id: true,
              name: true
            }
          },
          procedures: {
            select: {
              id: true,
              details: true
            }
          }
        }
      })
      res.status(200).json(dishes)
    } catch (e) {
      next(createError(e.statusCode, e.message))
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
      const { image, title, category, location, description, youtube, authorId } = req.body
      
      const createDish = await prisma.dish.create({
        data: {
          image: image,
          title: title,
          category: category,
          location: location,
          description: description,
          youtube: youtube,
          authorId: authorId
        }
      })
      res.status(200).json(createDish)
    } catch (e) {
      next(createError(e.statusCode, e.message))
    }
  }
}

module.exports = DishController