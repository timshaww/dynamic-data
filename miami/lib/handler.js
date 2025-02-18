let eList = require('../data/emails.json');

const fs = require('fs');

const nav = require('../data/navigation.json');

exports.newsletterSignup = (req, res) => {
	res.render('newsletter-signup', { csrf: 'supersecret' });
};

exports.newsletterSignupProcess = (req, res) => {
	console.log(req.body);
	eList.users.push(req.body);
	console.log(eList);
	let json = JSON.stringify(eList);
	fs.writeFileSync('./data/emails.json', json, 'utf-8');
	res.redirect(303, '/newsletter/list');
};

exports.newsletterSignupList = (req, res) => {
	const eList = require('../data/emails.json');
	console.log(eList);
	res.render('userspage', { users: eList.users, nav });
};

exports.newsletterUser = (req, res) => {
	console.log(eList);
	let userDetails = eList.users.filter((user) => {
		return user.email === req.params.email;
	});
	res.render('userdetails', { users: userDetails, nav });
};

exports.newsletterDelete = (req, res) => {
	console.log(eList);
	let newList = eList.users.filter((user) => {
		return user.email !== req.params.email;
	});
	eList.users = newList;
	let json = JSON.stringify(eList);
	fs.writeFileSync('./data/emails.json', json, 'utf-8');
	res.redirect(303, '/newsletter/list');
};
