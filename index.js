'use strict';

const sqlite3 = require('sqlite3').verbose(),
	  db = new sqlite3.Database('./db/database.db'),
      Sequelize = require('sequelize'),
      request = require('request'),
      express = require('express'),
      // filmRoutes = require('routes');      
      app = express();

const { PORT=3000, NODE_ENV='development', DB_PATH='./db/database.db' } = process.env;

// START SERVER
Promise.resolve()
  .then(() => app.listen(PORT, () => console.log(`App listening on port ${PORT}`)))
  .catch((err) => { if (NODE_ENV === 'development') console.error(err.stack); });

// ROUTES
app.get('/films/:id/recommendations', getFilmRecommendations);


// SQL
let sqlJoin = "SELECT films.id id, films.title title, films.release_date release_date, genres.name name from films inner join genres on genres.id = films.genre_id WHERE release_date BETWEEN datetime('now', '-15 years') AND datetime('now', 'localtime' )";


// ROUTE HANDLER
function getFilmRecommendations(req, res) {
  // res.status(500).send('You are the best');
	db.serialize(function() {
		
		
	});

	db.all(sqlJoin, [], (err, rows) => {
		if (err){
			console.log(err.message);
		}
		let hash = {};
		hash['recommendations'] = rows;
		res.json(hash);
	})


}
// database 




module.exports = app;
