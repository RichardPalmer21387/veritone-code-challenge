const api = require('./api.js');

module.exports = app => {
	app.use('/api', api);
};
