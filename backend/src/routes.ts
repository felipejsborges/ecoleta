import express from 'express';
import multer from 'multer';
import { celebrate, Joi } from 'celebrate';

import multerConfig from './config/multer'
import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

const routes = express.Router();
// the same of const app = express(), but in a different file of server.ts

const upload = multer(multerConfig);

const pointsController = new PointsController();
const itemsController = new ItemsController();

// list items route
routes.get('/items', itemsController.index);

// create point route
routes.post('/points',
upload.single('image'),
celebrate({
	body: Joi.object().keys({
		name: Joi.string().required(),
		email: Joi.string().required().email(),
		whatsapp: Joi.number().required().min(10).max(11),
		latitude: Joi.number().required(),
		longitude: Joi.number().required(),
		city: Joi.string().required(),
		uf: Joi.string().required().max(2),
		items: Joi.string().required(),
	})
}, {
	abortEarly: false,
}),
pointsController.create);

// list points route
routes.get('/points/', pointsController.index);

// show info of a specific point route
routes.get('/points/:id', pointsController.show);

export default routes;