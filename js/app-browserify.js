// es5 polyfills, powered by es5-shim
require("es5-shim")

// es6 polyfills, powered by babel
require("babel/polyfill")

var $ = require("jquery")

var _ = require("underscore")

var Backbone = require("backbone")

var Promise = require('es6-promise').Promise
// just Node?
// var fetch = require('node-fetch')
// Browserify?
// require('whatwg-fetch') //--> not a typo, don't store as a var

// other stuff that we don't really use in our own code
// var Pace = require("../bower_components/pace/pace.js")

// require your own libraries, too!
// var Router = require('./app.js')

// window.addEventListener('load', app)

// function app() {
    // start app
    // new Router()
// }

$(function(){

	//Create model for the services
	var Service = Backbone.Model.extend({
		defaults: {
			title: 'My service',
			price: 100,
			checked: false
		},

		//toggle is a helper function that sets the checked value to the opposite of it's current value for the selected model
		toggle: function() {
			this.set('checked', !this.get('checked'));
		}
	});

	//Create a collection of services
	var ServiceList = Backbone.Collection.extend({
		//tells collection to use the properties in the Service model
		model: Service,

		//Returns an array only with the checked services
		getChecked: function() {
			return this.where({checked:true});
		}
	});

	//Prefill the collection with a number of services(models)
	//created an instance of the collection
	var services = new ServiceList([
		new Service({ title: 'web development', price:200}),
		new Service({ title: 'web design', price:250}),
		new Service({ title: 'talking', price:5})
	]);

	//This view turns a Service model into HTML and creates li elements
	//THIS ENTIRE VIEW IS FOR ONE SERVICE, THE LOOP TO CREATE THE HTML FOR ALL SERVICES IS BELOW IN THE MAIN VIEW
	//NOTHING HAS BEEN CREATED OR AFFECTED YET(NO HTML HAS BEEN MADE)
	var ServiceView = Backbone.View.extend({
		tagName: 'li',

		events: {
			//on click, run toggleService function below
			'click': 'toggleService'
		},

		initialize: function() {
			//sets up event listeners 
			//listens to a model when any 'change' is done to it and renders it (or rerenders)
			this.listenTo(this.model, 'change', this.render);
		},

		render: function() {
			//Create the HTML for A service/model (A being one)
			//the $el refers to the tagName
			//what this line does is creates a new <li> and inserts the html for it's value so <li><input type.....
			this.$el.html('<input type="checkbox" value="1" name="' + 
				//gets the values of a service/model
				this.model.get('title') + '" /> ' + this.model.get('title') + '<span> $' + this.model.get('price') + '</span>');
			//sets the 'checked' property of the input checkbox to the model's
			this.$('input').prop('checked', this.model.get('checked'));

			//Returning the object is a good practice which makes chaining possible
			return this;
		},

		toggleService: function() {
			//toggles the 'checked' property
			this.model.toggle();
		}
	});

	//The main view of the app
	var App = Backbone.View.extend({
		//base the view on an existing element
		//the form element is the entire thing in this case
		el:$('#main'),

		initialize: function() {
			//cache selectors
			// vars to use as references
			this.total = $('#total span');
			this.list = $('#services');

			//listens for any changes done to the "services" collection (same thing as listening to every model)
			this.listenTo(services, 'change', this.render);

			//create views for every model in the collection
			services.each(function(service) {
				var view = new ServiceView({model:service});
				//add the rendered views to the "this.list" (or ul)
				this.list.append(view.render().el);
			//"this" is a callback which runs this function for every service recieved by this initialize function
			}, this);
		},

		render: function() {
			var total = 0;

			//calculate total order amount by adding only checked elements
			//services.getChecked() = all chekced elements in the services collection
			_.each(services.getChecked(), function(elem) {
				total += elem.get('price');
			});

			this.total.text('$' + total);

			return this;
		}
	});

	new App();
});


