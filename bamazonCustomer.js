var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'Bristol7515$#!',
	database: 'bamazon'
});

connection.connect(function(err) {
	if (err) throw err;
	start();
});

var start = function() {
	var choiceArray = [];

	//Product List
	connection.query('SELECT * FROM products', function(err, res) {
		for(var i = 0; i < res.length; i++) {
			console.log('\n' + res[i].id + ' | ' + res[i].product_name + ' | $' + res[i].price);
			choiceArray.push(res[i]);
		}
	});

	//Query User
	inquirer.prompt({
		name: 'id',
		type: 'input',
		message: 'Please enter ID of the product you would like to buy?'
	}).then(function(answer) {
		var chosen;

		//capture user choice
		for(var i = 0; i < choiceArray.length; i++) {
			if(choiceArray[i].id === parseInt(answer.id)) {
				chosen = choiceArray[i];
			}
		}

		//If user does not enter matching id
		if(chosen === undefined) {
			console.log('ID not recognized. \n');
			start();
		}

		//If user enters matching id
		inquirer.prompt({
			name: 'qty',
			type: 'input',
			message: 'Please ente the amount you would like to purchase'
		}).then(function(answer) {

			//sale
			if(chosen.stock_quantity >= parseInt(answer.qty)) {
				connection.query('UPDATE products SET ? WHERE ?', 
					[
						{stock_quantity: chosen.stock_quantity - parseInt(answer.qty)}, 
						{id: chosen.id}
					],
					function(err){
						if (err) throw err;
						console.log('Your total owed is $' + chosen.price * parseInt(answer.qty) + '.\n');
						start();
					});
			}

			else {
				console.log('Whoops looks like we only have ' + chosen.stock_quantity + '. Lets start over. \n');
				start();
			}
		})
	});
};