import express from 'express';
import authController from '../controllers/authControllers';
const router = express.Router();

router.post('/register', authController.createOrganization);
router.post('/register-user', authController.createUser);
router.post('/login', authController.login);
router.get('/verify-token', authController.verifyToken);

export default router;
