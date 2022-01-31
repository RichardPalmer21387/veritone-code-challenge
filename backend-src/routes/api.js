const Router = require('express-promise-router');
const moment = require('moment');
const {forEach, isEmpty} = require('lodash');

const db = require('../db');

const router = new Router();

router.get('/sync/:modified', async (request, response) => {
	const {modified} = request.params;
	const {rows} = await db.query('SELECT * FROM shoppinglistitems WHERE modified > $1', [modified]);
	if (isEmpty(rows)) {
		const {rows: syncRows} = await db.query('SELECT modified FROM shoppinglistitems ORDER BY modified DESC limit 1');
		if (isEmpty(syncRows)) {
			response.json({modified: moment(0).toISOString()});
		} else {
			response.json({modified: syncRows[0].modified});
		}
	} else {
		response.json(rows);
	}
});

router.post('/sync', async (request, response) => {
	const rows = request.body;
	console.log('SYNC INSERT:', request.body);
	const returnRows = [];
	const client = await db.getClient();
	await forEach(
		rows,
		async row => {
			const {insertedRows} = await client.query(
				'INSERT INTO shoppinglistitems (modified, name, description, quantity, purchased, deleted) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
				[
					row.modified,
					row.name,
					row.description,
					row.quantity,
					row.purchased,
					row.deleted,
				],
				error => {
					if (error) {
						throw error;
					}
				},
			);

			returnRows.push(insertedRows[0]);
		},
	);
	await client.release();
	response.status(201).json(returnRows);
});

router.get('/:id', async (request, response) => {
	const {id} = request.params;
	const {rows} = await db.query('SELECT * FROM shoppinglistitems WHERE id = $1', [id]);
	response.json(rows[0]);
});

router.post('/', async (request, response) => {
	const item = request.body;
	console.log('INSERT:', request.body);
	const {rows} = await db.query('INSERT INTO shoppinglistitems (modified, name, description, quantity, purchased, deleted) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [
		item.modified,
		item.name,
		item.description,
		item.quantity,
		item.purchased,
		item.deleted,
	],
	error => {
		if (error) {
			throw error;
		}
	});

	response.status(201).json(rows[0]);
});

router.put('/:id', async (request, response) => {
	const item = request.body;
	const {rows} = await db.query('SELECT * FROM shoppinglistitems WHERE id=$1', [
		request.params.id,
	],
	error => {
		if (error) {
			throw error;
		}
	});

	const dbItem = rows[0];

	if (
		moment(item.modified)
			.isAfter(
				moment(dbItem.modified),
			)
	) {
		await db.query('UPDATE shoppinglistitems SET modified=$1, name=$2, description=$3, quantity=$4, purchased=$5, deleted=$6 WHERE ID=$7',
			[
				item.modified,
				item.name,
				item.description,
				item.quantity,
				item.purchased,
				item.deleted,
				request.params.id,
			],
			error => {
				if (error) {
					throw error;
				}
			},
		);
		response.status(200).json({id: request.params.id});
	} else {
		response.status(200).json(dbItem); // We have a newer version on server so send to update local db.
	}
});

router.delete('/:id', async (request, response) => {
	response.status(405).json({
		error: 'DELETE not allowed!',
	});

	// Await db.query('DELETE FROM shoppinglistitem WHERE id=$1',
	// 	[
	// 		request.params.id,
	// 	],
	// 	error => {
	// 		if (error) {
	// 			throw error;
	// 		}
	// 	});

	// response.status(200).json({id: request.params.id});
});

module.exports = router;
