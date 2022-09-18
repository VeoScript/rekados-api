const createError = require("http-errors");
var bcrypt = require('bcryptjs')

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class AuthController {
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
          id: String(req.session.user.id)
        },
        select: {
          id: true,
          name: true,
          email: true
        }
      })
      res.status(200).json(user)
    } catch (e) {
      // next(createError(e.statusCode, e.message))
      console.error(e)
      process.exit(1)
    }
  }

  static register = async (req, res, next) => {
    // try {
      
    // } catch (e) {
    //   // next(createError(e.statusCode, e.message))
    //   console.error(e)
    //   process.exit(1)
    // }
    const { name, email, username, password } = req.body

    const foundUser = await prisma.user.findMany({
      where: {
        email: email
      },
      select: {
        email: true
      }
    })

    const check_email_exist = foundUser.some((user) => user.email === email)
    const check_username_exist = foundUser.some((user) => user.username === username)

    if (check_email_exist) {
      return res.status(500).json({
        message: 'Email already exists.'
      })
    }

    if (check_username_exist) {
      return res.status(500).json({
        message: 'Username already exists.'
      })
    }

    const salt = await bcrypt.genSalt()
    const hashPassword = await bcrypt.hash(password, salt)
    
    await prisma.user.create({
      data: {
        name: name,
        email: email,
        username: username,
        password: hashPassword
      }
    })

    res.status(200).json({
      message: 'Registered successfully.'
    })
  }

  static login = async (req, res, next) => {
    try {
      const { email, password } = req.body
  
      const foundUser = await prisma.user.findMany({
        where: {
          email: email
        },
        select: {
          id: true,
          email: true,
          password: true
        }
      })
  
      if (!foundUser[0]) {
        return res.status(500).json({
          message: 'Account not found, sign up first.'
        })
      }

      const userId = foundUser[0].id
      const userHashPassword = foundUser[0].password

      const matchedPassword = await bcrypt.compare(password, userHashPassword)

      if (!matchedPassword) {
        return res.status(500).json({
          message: 'Password is incorrect!'
        })
      }

      req.session.user = { id: userId }

      await req.session.save();
      
      res.status(200).json({
        message: 'Logged in successfully.'
      })
    } catch (e) {
      // next(createError(e.statusCode, e.message))
      console.error(e)
      process.exit(1)
    }
  }

  static logout = async (req, res) => {
    await req.session.destroy();

    res.status(200).json({
      message: 'Logged out successfully.'
    })
  }

  // static checkLogin = async (req, res) => {
  //   if (req.session.user !== undefined) {
  //     res.status(200).json({
  //       message: 'Authenticated'
  //     })
  //   } else {
  //     res.status(200).json({
  //       message: 'Unauthenticated'
  //     })
  //   }
  // }
}

module.exports = AuthController
