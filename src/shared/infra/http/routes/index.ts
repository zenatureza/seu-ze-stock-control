import { Router } from 'express';

import productsRouter from '@modules/products/infra/http/routes/products.routes';
import ordersRouter from '@modules/orders/infra/http/routes/orders.routes';

const routes = Router();

routes.use('/products', productsRouter);
routes.use('/orders', ordersRouter);

export default routes;
