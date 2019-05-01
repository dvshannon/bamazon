// calls the npm packages
const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: "localhost",
  
    // 
    PORT: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "Pacman33#",
    database: "bamazon"
  });

  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    readProducts();
  });

  function readProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.log(res);
      connection.end();
    });
  }

  function searchProducts() {
      let query = 'SELECT product_name, price FROM products WHERE ?';

    inquirer 
      .prompt([
          {
            name: 'ask_id',
            type: 'input',
            message: 'What is the id of the item you would like to buy?'
          },
          {
            name: 'quantity',
            type: 'number',
            message: 'How many would you like to order?'
          }
        ]).then(function(answer){
            connection.query(query,
                { answer: answer.number }, function(err, res) {
                for (var i = 0; i < res.length; i++) {
                  console.log("Position: " + res[i].position + " || Song: " + res[i].song + " || Year: " + res[i].year);
                }
                runSearch();
              });
            if (answer.ask_id) {
                console.log()
            }
        });
}