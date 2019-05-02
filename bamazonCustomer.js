// require dotenv
require("dotenv").config();

// require password
const password = require("./db_password.js");

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
    password: password.db_pass,
    database: "bamazon"
  });

  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    readProducts();
  });

  function readProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function(err, results) {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.log(results);  
      startUp();
    });
  }
  function startUp() {
    inquirer 
      .prompt([
          {
              name: 'options',
              type: 'list',
              messsage: 'What would you like to do today?',
              choices: ['buy', 'exit']
          }
      ]).then(function(answer){
          if (answer.options === 'buy') {
              searchProducts();
          } else {
              exit();
          }
      })
      
  }

  function searchProducts() {
      let query = "SELECT product_name, price, stock_quantity FROM products WHERE ?";

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
            const choiceID = parseInt(answer.ask_id);
            const quantity = parseInt(answer.quantity);
            // console.log(query);
            connection.query(query,
                { item_id: choiceID }, 
                function(err, results) {
                    // console.log(results,'results');

                for (var i = 0; i < results.length; i++) {
                  console.log("Name: " + results[i].product_name + " || Price: " + results[i].price);
                  let amountLeft = parseInt(results[i].stock_quantity) - quantity;
                  if (answer.ask_id) {
                    amountLeft--;
                    console.log('amt left ', amountLeft);
                        if (amountLeft < 0) {
                            console.log('Sorry! We have run out of ' + results[i].product_name);
                        } else {
                            console.log("Okay, we'll place an order of " + quantity + " for " + results[i].product_name);
                        }
                    }
                    
                }
                startUp();
              });

              
        });
        
}

function exit() {
    // process.exit();
    connection.end();
}
