'use strict';

module.exports = function(app)
{
	var films = require('controller');

	app.route('/films')
		.get(films.list_all_films)

	app.route('/films/:filmId')
		.get(films.read_film)
}