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

  static searchUsers = async (req, res, next) => {
    if (req.session.user === undefined) {
      res.status(401).json({
        message: 'Unauthorized!'
      })
      return
    }

    try {
      const users = await prisma.user.findMany({
        where: {
          name: {
            contains: String(req.params.name)
          }
        },
        select: {
          id: true,
          profile: true,
          name: true,
          username: true,
          location: true
        }
      })

      res.status(200).json(users)
    } catch (e) {
      next(createError(e.statusCode, e.message))
      process.exit(1)
    }
  }

  static getSearchHistories = async (req, res, next) => {
    if (req.session.user === undefined) {
      res.status(401).json({
        message: 'Unauthorized!'
      })
      return
    }

    try {
      const searchHistories = await prisma.searchHistory.findMany({
        where: {
          userId: String(req.params.userId)
        },
        select: {
          id: true,
          type: true,
          searchId: true,
          slug: true,
          image: true,
          title: true,
          description: true,
          updatedAt: true,
          userId: true
        }
      })
      res.status(200).json(searchHistories)
    } catch (e) {
      next(createError(e.statusCode, e.message))
      process.exit(1)
    }
  }

  static storeSearchHistoryDishes = async (req, res, next) => {
    if (req.session.user === undefined) {
      res.status(401).json({
        message: 'Unauthorized!'
      })
      return
    }

    try {
      const store = await prisma.searchHistory.create({
        data: {
          type: 'DISHES',
          searchId: req.body.searchId,
          slug: req.body.slug,
          image: req.body.image,
          title: req.body.title,
          description: req.body.description,
          updatedAt: new Date(),
          userId: req.body.userId
        }
      })
      res.status(200).json(store)
    } catch (e) {
      next(createError(e.statusCode, e.message))
      process.exit(1)
    }
  }

  static storeSearchHistoryPeople = async (req, res, next) => {
    if (req.session.user === undefined) {
      res.status(401).json({
        message: 'Unauthorized!'
      })
      return
    }

    try {
      const store = await prisma.searchHistory.create({
        data: {
          type: 'PEOPLE',
          searchId: req.body.searchId,
          slug: req.body.slug,
          image: req.body.image,
          title: req.body.title,
          description: req.body.description,
          updatedAt: new Date(),
          userId: req.body.userId
        }
      })
      res.status(200).json(store)
    } catch (e) {
      next(createError(e.statusCode, e.message))
      process.exit(1)
    }
  }
}

module.exports = SearchController
