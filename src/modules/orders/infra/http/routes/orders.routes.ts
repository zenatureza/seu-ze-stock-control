import { Router } from 'express';
import OrdersController from '../controllers/OrdersController';
import {
  celebrate,
  Segments,
  // , Joi
} from 'celebrate';
const Joi = require('joi-oid');

const ordersRouter = Router();
const ordersController = new OrdersController();

ordersRouter.get(
  '/:id?',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.objectId(),
    },
  }),
  ordersController.index,
);

ordersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      products: Joi.array().items({
        name: Joi.string().required(),
        quantity: Joi.number().required(),
      }),
    },
  }),
  ordersController.create,
);

export default ordersRouter;
