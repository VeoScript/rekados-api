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
          userId: String(req.params.userId),
          type: String(req.params.type)
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
        },
        orderBy: {
          updatedAt: 'desc'
        },
        take: 5
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
      const { searchId, slug, image, title, description, userId } = req.body

      const upsertHistory = await prisma.searchHistory.upsert({
        where: {
          searchId: searchId,
          userIdTracer: userId
        },
        update: {
          updatedAt: new Date()
        },
        create: {
          type: 'DISHES',
          userIdTracer: searchId,
          searchId: searchId,
          slug: slug,
          image: image,
          title: title,
          description: description,
          userId: userId
        }
      })

      res.status(200).json(upsertHistory)
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
      const { searchId, slug, image, title, description, userId } = req.body

      const upsertHistory = await prisma.searchHistory.upsert({
        where: {
          searchId: searchId,
          userIdTracer: userId
        },
        update: {
          updatedAt: new Date()
        },
        create: {
          type: 'PEOPLE',
          userIdTracer: searchId,
          searchId: searchId,
          slug: slug,
          image: image,
          title: title,
          description: description,
          userId: userId
        }
      })

      res.status(200).json(upsertHistory)
    } catch (e) {
      next(createError(e.statusCode, e.message))
      process.exit(1)
    }
  }

  static deleteSearchHistoryDishes = async (req, res, next) => {
    if (req.session.user === undefined) {
      res.status(401).json({
        message: 'Unauthorized!'
      })
      return
    }
    
    try {
      const deleteHistory = await prisma.searchHistory.deleteMany({
        where: {
          type: 'DISHES',
          userId: String(req.params.userId)
        }
      })
      res.status(200).json(deleteHistory)
    } catch (e) {
      next(createError(e.statusCode, e.message))
      process.exit(1)
    }
  }

  static deleteSearchHistoryPeople = async (req, res, next) => {
    if (req.session.user === undefined) {
      res.status(401).json({
        message: 'Unauthorized!'
      })
      return
    }
    
    try {
      const deleteHistory = await prisma.searchHistory.deleteMany({
        where: {
          type: 'PEOPLE',
          userId: String(req.params.userId)
        }
      })
      res.status(200).json(deleteHistory)
    } catch (e) {
      next(createError(e.statusCode, e.message))
      process.exit(1)
    }
  }
}

module.exports = SearchController
