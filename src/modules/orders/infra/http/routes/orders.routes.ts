import { Router } from 'express';
import OrdersController from '../controllers/OrdersController';

const productsRouter = Router();
const ordersController = new OrdersController();

productsRouter.get('/:id?', ordersController.index);
productsRouter.post('/', ordersController.create);

export default productsRouter;
