let eList = require('../data/emails.json');

const fs = require('fs');

const nav = require('../data/navigation.json');

exports.newsletterSignup = (req, res) => {
	res.render('newsletter-signup', { csrf: 'supersecret', nav: nav });
};

exports.newsletterSignupProcess = (req, res) => {
	eList.users.push(req.body);
	let json = JSON.stringify(eList);

	fs.writeFileSync('./data/emails.json', json, 'utf-8');

	res.redirect(303, '/newsletter/list');
};

exports.newsletterSignupList = (req, res) => {
	const eList = require('../data/emails.json');
	res.render('userspage', { users: eList.users, nav: nav });
};

exports.newsletterUser = (req, res) => {
	let userDetails = eList.users.filter((user) => {
		return user.email === req.params.email;
	});
	res.render('userdetails', { users: userDetails, nav });
};

exports.newsletterDelete = (req, res) => {
	let newsList = {};

	newsList.users = eList.users.filter((user) => {
		return user.email != req.params.email;
	});
	console.log('Deleting ' + req.params.email);

	let json = JSON.stringify(newsList);

	fs.writeFileSync('./data/emails.json', json, 'utf-8', () => {});

	delete require.cache[require.resolve('../data/emails.json')];

	res.redirect(303, '/newsletter/list');
};
