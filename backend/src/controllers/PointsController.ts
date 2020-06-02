import { Request, Response} from 'express';
import knex from '../database/connection';

class PointsController {
	async index(request: Request, response: Response) {
		const {city, uf, items} = request.query;

		// turn items id in an array
		const parsedItems = String(items).split(',').map(item => Number(item.trim()));

		// applying filters and getting points that are relationed with point_items table
		const points = await knex('points')
		.join('point_items', 'points.id', '=', 'point_items.point_id')
		.whereIn('point_items.item_id', parsedItems) // whereIn to use an array
		.where('city', String(city))
		.where('uf', String(uf))
		.distinct() // because we dont want to repeat points
		.select('points.*');

		return response.json(points);
	}

	async show(request: Request, response: Response) {
		const { id } = request.params;

		// getting a point on points table where id on table is equal the id on request params
		const point = await knex('points').where('id', id).first();
		// first because, by default, this method returns an array, so we use the first to turn it into a unique stuff, and not a list

		// if it dont find, it means that does not exist a point with this ID
		if (!point) {
			return response.status(400).json({ message: 'Point not found.' });
		}
		
		// getting item on items table that are relationed with point_items table
		const items = await knex('items')
		.join('point_items', 'items.id', '=', 'point_items.item_id')
		.where('point_items.item_id', id)
		.select('items.title');

		return response.json({ point, items });
	}

	async create(request: Request, response: Response) {
		const { name, email, whatsapp, latitude, longitude, city, uf, items } = request.body;

		const point = { image: 'image-fake', name, email, whatsapp, latitude, longitude, city, uf };

		const trx = await knex.transaction();
		// now, if one operation on DB fail, all with 'trx' will fail
	
		// inserting point on points table
		const insertedIds = await trx('points').insert(point);
		
		// when we create rows in a table, it returns the ID's of the inserted rows. We inserted only one point, so this array.length = 1, and the unique item is the id of the created point	
		const point_id = insertedIds[0];
	
		const pointItems = items.map((item_id: number) => {
			return {
				item_id,
				point_id,
			};
		});
	
		// inserting point items on point items table
		await trx('point_items').insert(pointItems);

		await trx.commit();
	
		return response.json({ id: point_id, ...point });
	}
}

export default PointsController;