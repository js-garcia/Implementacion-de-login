import { Router } from 'express'
import bcrypt from 'bcrypt'
import UserActivation from '../models/userActivationModel'

const router = Router()
const auth = (req, res, next) => {
    try {
        if (req.session.user) {
            if (req.session.user.admin === true) {
                next()
            } else {
                res.status(403).send({ status: 'ERR', data: 'Usuario no admin' })
            }
        } else {
            res.status(401).send({ status: 'ERR', data: 'Usuario no autorizado' })
        }   
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
}

router.get('/', async (req, res) => {
    try {
        if (req.session.visits) {
            req.session.visits++
            res.status(200).send({ status: 'OK', data: `Cantidad de visitas: ${req.session.visits}` })
        } else {
            req.session.visits = 1
            res.status(200).send({ status: 'OK', data: 'Bienvenido al site!' })
        }
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
})

router.get('/logout', async (req, res) => {
    try {
        // req.session.destroy nos permite destruir la sesión
        // De esta forma, en la próxima solicitud desde ese mismo navegador, se iniciará
        // desde cero, creando una nueva sesión y volviendo a almacenar los datos deseados.
        req.session.destroy((err) => {
            if (err) {
                res.status(500).send({ status: 'ERR', data: err.message })
            } else {
                // El endpoint puede retornar el mensaje de error, o directamente
                // redireccionar a login o una página general.
                // res.status(200).send({ status: 'OK', data: 'Sesión finalizada' })
                res.redirect('/login')
            }
        })
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
})

// Este es un endpoint "privado", solo visible para admin.
// Podemos ver que el contenido no realiza ninguna verificación, ya que la misma se hace
// inyectando el middleware auth en la cadena (ver definición auth arriba).
// Si todo va bien en auth, se llamará a next() y se continuará hasta aquí, caso contrario
// la misma rutina en auth() cortará y retornará la respuesta con el error correspondiente.
router.get('/admin', auth, async (req, res) => {
    try {
        res.status(200).send({ status: 'OK', data: 'Estos son los datos privados' })
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
})

// Nuestro primer endpoint de login!, básico por el momento, con algunas
// validacione "hardcodeadas", pero nos permite comenzar a entender los conceptos.
/*router.post('/login', async (req, res) => {
    try {
        const { user, pass } = req.body
      
        if (user === 'jsgarcia' && pass === 'abc123') {
            req.session.user = { username: user, admin: true }
            res.redirect('/products')
        } else {
            res.status(401).send({ status: 'ERR', data: 'Datos no válidos' })
        }
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
})*/

router.post('/login', async (req, res) => {
    try {
        const { user, pass } = req.body
        let role = 'user'
      
        if (user === 'adminCoder@coder.com' && pass === 'adminCod3r123') {
            role = 'admin'
            req.session.user = { username: user, admin: true }
            res.redirect('/products')
        } else {
            res.status(401).send({ status: 'ERR', data: 'Datos no válidos' })
        }
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }

    const newUser = new UserActivation({
        user : user,
        pass : hashedPass,
        role : role
       })

 
       newUser.save((err) => {
        if (err) {
            res.redirect('/register')
        } else {
            res.redirect('/login')
        }
       })


})

router.post('/register', async (req, res) => {
   const { user, pass } = req.body
   
})

export default router