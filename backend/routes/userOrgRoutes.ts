import { Router } from 'express';
import { UserOrgController } from '../controllers/userOrgController';

const router = Router();

router.get('/:id', UserOrgController.getUser);
router.get('/org/:id', UserOrgController.getOrganization);

export default router;
