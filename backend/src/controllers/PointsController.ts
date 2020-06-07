import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {
	// list filtered points method:
	async index(request: Request, response: Response) {
		const { city, uf, items } = request.query;
		let parsedItems = [];
		// turn items id in an array
		if (!Array.isArray(items)) {
			parsedItems = String(items)
				.split(',')
				.map(item => Number(item.trim()));
		} else {
			parsedItems = [...items];
		}

		let points = [];

		// if the user does not insert one or more items, show all points of that city
		if (parsedItems.length < 1 || !items) {
			points = await knex('points')
				.join('point_items', 'points.id', '=', 'point_items.point_id')
				.where('city', String(city))
				.where('uf', String(uf))
				.distinct() // because we dont want to repeat points
				.select('points.*');
			// if not, filter by item too
		} else {
			// applying filters and getting points that are relationed with point_items table
			points = await knex('points')
				.join('point_items', 'points.id', '=', 'point_items.point_id')
				.whereIn('point_items.item_id', parsedItems as number[]) // whereIn to use an array
				.where('city', String(city))
				.where('uf', String(uf))
				.distinct()
				.select('points.*');
		}

		// serializing points
		const serializedPoints = points.map(point => {
			return {
				...point,
				image_url: `http://localhost:3333/uploads/${point.image}`,
			};
		});

		return response.json(serializedPoints);
	}

	// show a specific point by id method:
	async show(request: Request, response: Response) {
		const { id } = request.params;

		// getting a point on points table where id on table is equal the id on request params
		const point = await knex('points').where('id', id).first();
		// first because, by default, this method returns an array, so we use the first to turn it into a unique stuff, and not a list

		// if it dont find, it means that does not exist a point with this ID
		if (!point) {
			return response.status(400).json({ message: 'Point not found.' });
		}

		// serializing point
		const serializedPoint = {
			...point,
			image_url: `http://localhost:3333/uploads/${point.image}`,
		};

		// getting item on items table that are relationed with point_items table
		const items = await knex('items')
			.join('point_items', 'items.id', '=', 'point_items.item_id')
			.where('point_items.point_id', id)
			.select('items.title');

		return response.json({ point: serializedPoint, items });
	}

	// create point method
	async create(request: Request, response: Response) {
		const {
			name,
			email,
			whatsapp,
			latitude,
			longitude,
			city,
			uf,
			items,
		} = request.body;

		const point = {
			image: request.file.filename,
			name,
			email,
			whatsapp,
			latitude,
			longitude,
			city,
			uf,
		};

		const trx = await knex.transaction();
		// now, if one operation on DB fail, all with 'trx' will fail

		// inserting point on points table
		const insertedIds = await trx('points').insert(point);

		// when we create rows in a table, it returns the ID's of the inserted rows. We inserted only one point, so this array.length = 1, and the unique item is the id of the created point
		const point_id = insertedIds[0];

		const pointItems = items
			.split(',')
			.map((item: string) => Number(item.trim()))
			.map((item_id: number) => {
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
