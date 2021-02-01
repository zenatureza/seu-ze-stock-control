import { Router } from 'express';
import OrdersController from '../controllers/OrdersController';
import { celebrate, Segments, Joi } from 'celebrate';
const JoiObjectId = require('joi-oid');

const ordersRouter = Router();
const ordersController = new OrdersController();

ordersRouter.get(
  '/:id?',
  celebrate({
    [Segments.PARAMS]: {
      id: JoiObjectId.objectId(),
    },
    [Segments.QUERY]: {
      page: Joi.number().integer().min(0).messages({
        'number.min': `"page" should be bigger than 0 and integer`,
      }),
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
