import { Router } from 'express';
import ProductsController from '../controllers/ProductsController';

const productsRouter = Router();
const productsController = new ProductsController();

productsRouter.get('/:name', productsController.index);

export default productsRouter;
