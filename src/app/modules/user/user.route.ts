import express from 'express';
import { UserControllers } from './user.controller';

const router = express.Router();

// router.post('/create-user', UserControllers.createUser);
router.post('/', UserControllers.createUser);
router.get('/', UserControllers.getUsers);
router.get('/:userId', UserControllers.getUserById);
router.put('/:userId', UserControllers.updateOneUser);
router.delete('/:userId', UserControllers.deleteUserById);
router.put('/:userId/orders', UserControllers.updateOrder);
router.get('/:userId/orders', UserControllers.getAllOrderByUserId);
router.get(
  '/:userId/orders/total-price',
  UserControllers.getTotalPriceByUserId,
);

export const UserRoutes = router;
