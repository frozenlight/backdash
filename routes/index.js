let express = require('express')
let nimble = require('nimble')
let router = express.Router()

// Import mongoose models
let Group = require('../models/Group.js')
let Website = require('../models/Website.js')

/* GET home page. */
router.route('/')
	.get((req, res, next) => {
		render_index (req, res)
	})


router.route('/add-group')
	.post((req, res) => {
		console.log('Hit by post to /add-group with body: ' + JSON.stringify(req.body))
		let name = req.body.group_name
		Group.findOne({name:name}, (err, group) => {
			if (err) {
				render_error(res, err)
			} 
			if (!group) {
				console.log('Could not find a group with the same name, continuing...')
				Group.create(Group.formFill(req.body), (err) => {
					if (err) {
						render_error(res, err)
					} else {
						res.redirect('/')
					}
				})
			} else {
				console.log('Found group with that name, aborting...')
				render_index (req, res, 'A group with that name already exists!')
			}
		})
	})

router.route('/add-website/:group_slug')
	.post((req, res) => {
		let slug = req.params.group_slug
		Group.findOne({slug:slug}, (err, group) => {
			if (err) {
				render_error(res, err)
			}
			if (group) {
				let new_website = new Website(Website.formFill(req.body, group.id))

				new_website.save((err) => {
					if (err) {
						render_error(res, err)
					} else {
						group.websites.push(new_website.id)
						console.log(group)
						group.save((err) => {
							if (err) {
								render_error(res, error)
							} else {
								console.log(group)
								res.redirect('/')
							}
						})
					}
				})
			} else {
				render_index (req, res, 'Could not find a group with that url!')
			}
		})
	})

router.route('/api/groups') 
	.get((req, res) => {
		Group.find()
			.populate('websites')
			.exec((err, groups) => {
				if (err) {
					render_error(res, err)
				} else {
					res.json(groups)
				}
			})
	})

router.route('/api/websites') 
	.get((req, res) => {
		Website.find()
			.populate('group')
			.exec((err, websites) => {
				if (err) {
					render_error(res, err)
				} else {
					res.json(websites)
				}
			})
	})

// Function for editing a group object, equal for add and edit routes
// Lets you edit only oen function for the two use cases witch are quite equal
function edit_group (group, input) {

	let edited = false

	if (validate_input(input.group_name)) {
		group.name = input.group_name
		edited = true
	}
	if (validate_input(input.group_icon)) {
		group.icon = input.group_icon
		edited = true
	}
	if (validate_input(input.group_image)) {
		group.image = input.group_image
		edited = true
	}
	if (edited) {
		return group
	} else {
		return edited
	}
}
function render_error (res, error) {
	res.render('error', {error:error})
}
function render_index (req, res, message) {
	Group.find()
		.populate('websites')
		.exec((err, groups) => {
			if (err) {
				res.render('error', {error:err})
			} else {
				let objects = {
					groups:groups
				}
				if (message) {
					objects.message = message
				}
				res.render('index', objects)
			}
		})
}

function validate_input (input) {
	if (!input || input === '') {
		return false
	} else {
		return true
	}
}

module.exports = router
