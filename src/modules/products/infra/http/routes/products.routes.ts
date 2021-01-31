import { Router } from 'express';
import ProductsController from '../controllers/ProductsController';
import { celebrate, Segments, Joi } from 'celebrate';

const productsRouter = Router();
const productsController = new ProductsController();

productsRouter.get(
  '/:name',
  celebrate({
    [Segments.PARAMS]: {
      name: Joi.string().required(),
    },
  }),
  productsController.index,
);

export default productsRouter;
