'use strict';

const sqlite3 = require('sqlite3').verbose(),
db = new sqlite3.Database('./db/database.db'),
Sequelize = require('sequelize'),
request = require('request'),
express = require('express'),
axios = require('axios'),      
app = express();


const { PORT=3000, NODE_ENV='development', DB_PATH='./db/database.db' } = process.env;

// START SERVER
Promise.resolve()
.then(() => app.listen(PORT, () => console.log(`App listening on port ${PORT}`)))
.catch((err) => { if (NODE_ENV === 'development') console.error(err.stack); });

// ROUTES
app.get('/films/:id/recommendations', getFilmRecommendations);


// ROUTE HANDLER
function getFilmRecommendations(req, res) {
	// db.serialize(function() {		
	// });
	let paramsId = req.params.id;
	let genre = 'SELECT genre_id from films where id = ' + paramsId;
	let reviewCount = 0;
	let hash = {};
	let url = 'http://credentials-api.generalassemb.ly/4576f55f-c427-4cfc-a11c-5bfe914ca6c1?films=';
	let results = [];

	db.get('SELECT Id id from films where Id=?',[paramsId],(err,row)=>{
		if(row === undefined)
		{
			res.body = 
			res.status(422).send({message:'"message" key missing'});
		}
		else
		{

			db.all(genre, [], (err, row) => 
			{
				let genreId = row[0].genre_id;
				let sqlJoin = "SELECT films.id id, films.title title, films.release_date release_date, genres.name name from films inner join genres on genres.id = films.genre_id WHERE release_date BETWEEN datetime('now', '-15 years') AND datetime('now', 'localtime') AND genre_id = " + genreId + " ORDER BY id ASC";


		db.all(sqlJoin, [], (err, rows) => 
		{


			rows.forEach((row) => 
			{
				results.push(url+row.id);


			});

			let promise = results.map(url => axios.get(url));

			axios.all(promise)
			.then(function(res)
			{

				for (let i = 0; i < res.length; i++)
				{
					let avg = 0;
					let sum = 0;
					let row = rows[i];

					row['reviews'] = res[i].data[0].reviews.length;

					let ratings = res[i].data[0].reviews;
					for (let j = 0; j < ratings.length; j++)
					{
						if (ratings[i] != undefined )
						{
							sum += parseInt(ratings[i].rating);
							
						}
						else
						{
							rows[i]['averageRating'] = 'No Rating Submitted';
						}
					}
					avg = sum / ratings.length;
					rows[i]['averageRating'] = avg;
				}
			})
			.then(() => 
			{
				rows.filter(row => row.reviews >= 5), row.averageRating > 4;
				hash['recommendations'] = rows;
				hash['meta'] = {'limit' : 'limit', 'offset': 'offset'};
				res.json(hash);
			})


		})

	})

		}


	})

}


app.use(function(req, res, next) {
	res.status(404)

	if(req.accepts('json'))
	{
		res.send({'message' : 'message not found'});
		return;
	}
})

module.exports = app;
