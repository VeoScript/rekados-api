const createError = require("http-errors");
require('express-async-errors');

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class NotificationController {
  static index = async (req, res, next) => {
    if (req.session.user === undefined) {
      res.status(401).json({
        message: 'Unauthorized!'
      })
      return
    }

    try {
      const limit = 10
      const cursor = req.query.cursor ?? ''
      const cursorObj = cursor === '' ? undefined : { id: String(cursor) }

      const notifications = await prisma.notification.findMany({
        where: {
          notificationToId: String(req.session.user.id)
        },
        select: {
          id: true,
          type: true,
          read: true,
          message: true,
          createdAt: true,
          dishSlug: true,
          notificationFrom: {
            select: {
              id: true,
              name: true,
              username: true
            }
          },
          notificationTo: {
            select: {
              id: true,
              name: true,
              username: true
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
        notifications,
        nextId:  notifications.length === limit ? notifications[limit - 1].id : undefined
      })
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
      const { type, message, dishSlug, notificationFromId, notificationToId } = req.body

      const notification = await prisma.notification.create({
        data: {
          type: type,
          message: message,
          dishSlug: dishSlug,
          notificationFromId: notificationFromId,
          notificationToId: notificationToId
        }
      })

      res.status(200).json(notification)
    } catch (e) {
      next(createError(e.statusCode, e.message))
      process.exit(1)
    }
  }

  static read = async (req, res, next) => {
    if (req.session.user === undefined) {
      res.status(401).json({
        message: 'Unauthorized!'
      })
      return
    }

    try {
      const readNotification = await prisma.notification.update({
        where: {
          id: String(req.params.notificationId)
        },
        data: {
          read: true
        }
      })

      res.status(200).json(readNotification)
    } catch (e) {
      next(createError(e.statusCode, e.message))
      process.exit(1)
    }
  }

  static markAllAsRead = async (req, res, next) => {
    if (req.session.user === undefined) {
      res.status(401).json({
        message: 'Unauthorized!'
      })
      return
    }

    try {
      const readAllNotification = await prisma.notification.updateMany({
        where: {
          notificationToId: String(req.session.user.id)
        },
        data: {
          read: true
        }
      })

      res.status(200).json(readAllNotification)
    } catch (e) {
      next(createError(e.statusCode, e.message))
      process.exit(1)
    }
  }
}

module.exports = NotificationController
