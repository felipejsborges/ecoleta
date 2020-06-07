import knex from 'knex';
import path from 'path';

// setting connection to DB
const connection = knex({
	client: 'sqlite3',
	connection: {
		filename: path.resolve(__dirname, 'database.sqlite'),
	},
	useNullAsDefault: true, // stop error when run migrations
});

export default connection;
