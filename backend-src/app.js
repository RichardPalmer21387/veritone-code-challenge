const express = require('express');

const app = express();
const port = 3001;

app.use(express.json());

const mountRoutes = require('./routes/index.js');

mountRoutes(app);

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
