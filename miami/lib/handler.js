let eList = require('../data/emails.json')

const fs = require('fs')

exports.newsletterSignup = (req,res) => {
    res.render('newsletter-signup', { csrf : 'supersecret'  })
 }
 
exports.newsletterSignupProcess = (req,res) => {
    console.log(req.body)
    eList.users.push(req.body)
    console.log(eList)
    let json = JSON.stringify(eList)
    fs.writeFileSync('./data/emails.json', json, 'utf-8')
    res.redirect(303, '/newsletter/list')
}

exports.newsletterSignupList = (req,res) => {
    console.log(eList)
    res.render('userspage', {"users":eList.users})
}