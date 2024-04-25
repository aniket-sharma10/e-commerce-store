import express from 'express'
import { deleteUser, getUser, getAllUsers, signout, updateUser } from '../controllers/user-controller.js'
import auth from '../middlewares/authentication.js'
const router = express.Router()

router.post('/signout', signout)
router.get('/getAllUsers', auth, getAllUsers) 
router.get('/:userId', getUser)
router.post('/update/:userId', auth, updateUser)
router.delete('/delete/:userId', auth, deleteUser)

export default router