const createError = require("http-errors");
require('express-async-errors');

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class SearchController {
  static searchDishes = async (req, res, next) => {
    if (req.session.user === undefined) {
      res.status(401).json({
        message: 'Unauthorized!'
      })
      return
    }

    try {
      const dishes = await prisma.dish.findMany({
        where: {
          title: {
            contains: String(req.params.title)
          }
        }
      })

      res.status(200).json(dishes)
    } catch (e) {
      next(createError(e.statusCode, e.message))
      process.exit(1)
    }
  }
}

module.exports = SearchController
