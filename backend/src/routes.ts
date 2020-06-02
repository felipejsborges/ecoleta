import express from 'express';

import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

const routes = express.Router();
// the same of const app = express(), but in a different file of server.ts

const pointsController = new PointsController();
const itemsController = new ItemsController();

// list items route
routes.get('/items', itemsController.index);

// create point route
routes.post('/points', pointsController.create);

// list points route
routes.get('/points/', pointsController.index);

// show info of a specific point route
routes.get('/points/:id', pointsController.show);

export default routes;