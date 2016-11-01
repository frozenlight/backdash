let express = require('express')
let nimble = require('nimble')
let router = express.Router()

// Import mongoose models
let Group = require('../models/Group.js')
let Website = require('../models/Website.js')

// Add method override to make DELETE requests possible from standard HTML forms
// To use, add hidden input with name="_method" and value="DELETE"
router.use(function(req,res,next){
    if ( req.query._method == 'DELETE' || req.body._method == 'DELETE') {
        req.method = 'DELETE'
        req.url = req.path
        console.log(JSON.stringify(req.body))
    }      
	next()
})

/* GET home page. */
router.route('/')
	.get((req, res, next) => {
		render_index (req, res)
	})


router.route('/add-group')
	.post((req, res) => {
		console.log('Hit by POST to /add-group with body: ' + JSON.stringify(req.body))
		let name = req.body.group_name
		Group.findOne({slug:Group.createSlug(name)}, (err, group) => {
			if (err) {
				render_error(res, err)
			} 
			if (!group) {
				console.log('Could not find a group with the same name, continuing...')
				let new_group = Group.formFill(new Group(), req.body)
				new_group.save((err) => {
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

router.route('/edit-group/:group_slug')
	.post((req, res) => {
		let slug = req.params.group_slug
		Group.findOne({slug:slug}, (err, group) => {
			if (err) {
				render_error(res, err)
			} else {
				group = Group.formFill(group, req.body)
				group.save((err) => {
					if (err) {
						render_error(res, err)
					} else {
						res.redirect('/')
					}
				})
			}
		})
	})
	.delete((req, res) => {
		let slug = req.params.group_slug
		Group.findOneAndRemove({slug:slug}, (err, group) => {
			if (err) {
				render_error(res, err)
			} else if (group.websites.length) {
				Website.findByIdAndRemove({id: {$in: group.websites}}, (err) => {
					if (err) {
						render_error(res, err)
					} else {
						res.redirect('/')
					}
				})
			} else {
				res.redirect('/')
			}
		})
	})

// Route for adding website to group, only POST requests
router.route('/add-website/:group_slug')
	
	// Function for recieved POST request
	.post((req, res) => {

		let slug = req.params.group_slug

		console.log('Hit by POST to /add-website/' + slug + ' with body: ' + JSON.stringify(req.body))

		// Find the group corresponding to the URL-slug for the group 
		Group.findOne({slug:slug}, (err, group) => {
			if (err) {
				render_error(res, err)
			}

			// If group exists, continue..
			if (group) {

				// Create new website-object with form info and add group.id to link them
				let new_website = Website.formFill(new Website(), req.body, group.id)

				// Save new website object
				new_website.save((err) => {
					if (err) {
						render_error(res, err)

					// If there are no errors, continue by adding website.id to the group object
					} else {
						group.websites.push(new_website.id)

						// Save the group object
						group.save((err) => {
							if (err) {
								render_error(res, error)

							// If seccessfull, redirect to index page
							} else {
								console.log(group)
								res.redirect('/')
							}
						})
					}
				})

			// If not found, render index with error message
			} else {
				render_index (req, res, 'Could not find a group with that url!')
			}
		})
	})

router.route('/edit-website/:website_slug/')
	.post((req, res) => {
		let slug = req.params.website_slug
		Website.findOne({slug:slug}, (err, website) => {
			if (err) {
				render_error(res, err)
			} else {
				website = Website.formFill(website, req.body)
				website.save((err) => {
					if (err) {
						render_error(res, err)
					} else {
						res.redirect('/')
					}
				})
			}
		})
	})
	.delete((req, res) => {
		let slug = req.params.website_slug
		Website.findOneAndRemove({slug:slug}, (err, group) => {
			if (err) {
				render_error(res, err)
			} else {
				Group.find({websites: website.id}, (err, groups) => {
					if (err) {
						render_error(res, err)
					} else {
						groups.websites = groups.websites.filter((id) => id == website.id)
						groups.save((err) => {
							if (err) {
								render_error(res, err)
							} else {
								res.redirect('/')
							}
						})
					}
				})
			}
		})
	})

// API routes, mostly for debug information
// Should be put into their own routes file

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

// Render functions, just to make it a little easier to render special pages when needed

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

module.exports = router
