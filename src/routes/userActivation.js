import { Router } from "express"
import UserActivation from "../models/userActivationModel"

const router = Router

router.get('/', async (req, res) => {
    try {
        const users = await controller.getUsersPaginated()
        res.status(200).send({ status: 'OK', data: users })
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }

})


export default router