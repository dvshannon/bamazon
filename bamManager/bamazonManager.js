// require dotenv
require('dotenv').config();

// require password
const password = require('../db_password.js');

// calls the npm packages
const mysql = require('mysql');
const inquirer = require('inquirer');


const connection = mysql.createConnection({
    host: 'localhost',
    PORT: 3306,
    user: 'root',
    // password: password.db_pass,
    password: 'password',
    database: 'bamazon'
  });

  connection.connect(function(err) {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId + '\n');
    startManager();
  });

  function startManager() {
    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;
        managerOptions(res)
      });
  }

  function managerOptions(products) {
    function viewInventory() {
      console.table(products);
    }
    inquirer
      .prompt([
        {
          name: 'options',
          type: 'list',
          message: 'Select an option',
          choices: ['View products', 'Check low inventory', 'Add to inventory', 'Add new product', 'exit']
        }
      ])
      .then(function(answer){
        switch (answer.options) {
          case 'View products':
            viewInventory(products);
            managerOptions();
            break;

          case 'Check low inventory':
            checkLowInventory();
            break;

          case 'Add to inventory':
            findItemToAddToInventory(products);
            break;

          case 'Add new product':
              inqForNewProduct(products);
            break;

          case 'exit':
            exit();
            break;
        }
      })
  }

  function checkLowInventory() {
    // tracks the products stock with 5 or less items ready to be sold
    connection.query('SELECT * FROM products WHERE stock_quantity < 6', function(err, res) {
      if (err) throw err;

      console.table(res);
      startManager();
    });
  }
  function findItemToAddToInventory(products) {
    console.table(products);
      inquirer
        .prompt([
          {
            type:'input',
            name: 'item_id',
            message: 'Please enter the id of the product you want to stock up on'
          }
        ])
        .then(function(answer){
          let choiceID = parseInt(answer.item_id);
          console.log('You have chosen to stock up on item id number ' + choiceID);
          inqForAddToInventory(choiceID);
        })
  }
  function inqForAddToInventory(choiceID) {
      inquirer
        .prompt([
          {
            type: 'number',
            name: 'stock_quantity',
            message: 'How many would you like to add?',
          }
        ])
        .then(function(answer) {
          let quantity = parseInt(answer.stock_quantity);
          addToInventory(choiceID, quantity);
        });
  }
  function addToInventory(quantity, choiceID) {
    connection.query(
      'UPDATE products SET stock_quantity = ? WHERE item_id = ?',
      [quantity.stock_quantity, choiceID.item_id],
        function(err, res) {
          console.log(err);
        }
      )
      managerOptions();
  }

  function inqForNewProduct(products) {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'product_name',
          message: 'What is the name of this new product?'
        },
        {
          type: 'list',
          name: 'department_name',
          message: 'Which department does this product belong to?',
          choices: ['pc', 'music', 'food', 'accesories', 'shoes', 'clothing']
        },
        {
          type: 'number',
          name: 'price',
          message: 'How much does this item cost?'
        },
        {
          type: 'number',
          name: 'stock_quantity',
          message: 'How many are available?'
        }
      ])
      .then(addNewProduct)
  }

  function addNewProduct(newProduct) {
    connection.query(
      'INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)',
      [newProduct.product_name, newProduct.department_name, newProduct.price, newProduct.stock_quantity],
      function(err, res) {
        if (err) throw err;

        console.log(newProduct.product_name + ' has been added to the inventory \n');
        managerOptions();
      }
    );
  }

  function exit() {
    connection.end();
}
