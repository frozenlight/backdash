var mongoose = require('mongoose')

var Group = require('./Group.js')

var WebsiteSchema = new mongoose.Schema({
	name: {type: String, default: ''},
	link: {type: String, default: ''},
	icon: {type: String, default: ''},
	image: {type: String, default: ''},
	description: {type: String, default: ''},
	group: {type: mongoose.Schema.ObjectId, ref: 'Group'},
})

module.exports = mongoose.model('Website', WebsiteSchema)
