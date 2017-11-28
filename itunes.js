//setup for connection database

//node modules to request
var pg = require('pg');
var inquirer = require('inquirer');

//you have to pick the database to connect to;
var dbUrl = {
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: 'itunes',
	host: 'localhost',
	port: 5432
};

//creating a client to connect to, which as you see, uses the object that we set up
var pgClient = new pg.Client(dbUrl);

//officially connecting to that postgres database
pgClient.connect();

console.log("Welcome to this awesome itunes app");

var start = () => {
	inquirer.prompt([
		{
			type: "list",
			message: "Sign Up/Sign In",
			choices: ["Sign Up", "Sign In"],
			name: "sign_choice"
		}
	]).then(function(sign){
		if(sign.sign_choice === "Sign Up"){
			console.log("working to this point")
			inquirer.prompt([
			{
				type: "input",
				message: "Please enter your name",
				name: "name"
			},
			{
				type: "input",
				message: "Please enter a username",
				name: "username"
			},
			{
				type: "input",
				message: "please enter a desired password",
				name: "password"
			}

			]).then(function(signup){
				pgClient.query('INSERT INTO users(name, username, password) VALUES ($1, $2, $3)', [signup.name, signup.username, signup.password] , (err,result) =>{
					console.log("You're signed up. Please sign in now");
					start();
				});
			});
			
		}else {
			inquirer.prompt([
			{
				type: "input",
				message: "Please enter your username",
				name: "username"
			},
			{
				type: "input",
				message: "enter your password",
				name: "password"
			}
			]).then((res) => {
				//console.log(res.username);
				pgClient.query(`SELECT * FROM users WHERE username='${res.username}'`, (err, result) => {
					if(result.rows.length > 0){
					console.log(res.username);
					console.log('lets see if it works')
						if(result.rows.password === res.password){
							console.log("Welcome to this awesome terminal itunes app " + result.rows[0]);
						} else {
							console.log('Something went wrong');
						}
					} else {
							console.log('A lot is wrong at this point');
					}
				})
			})
		}
	})
}

start();


// pgClient.query("SELECT id FROM users WHERE username='" + create_user.username + "'", (selectUserErrTwo, selectUserResTwo) => {
// 				pgClient.query('UPDATE profile SET ' + field + '=$1 WHERE user_id=' + selectUserResTwo.rows[0].id, [update_profile.update_value] , (update_profile_err, update_profile_result) => {});
// 			});





