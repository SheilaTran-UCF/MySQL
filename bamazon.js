var mysql = require("mysql");
var inquirer = require("inquirer");
const Table = require("cli-table2");
const colors = require("colors")

// Initializes the connection variable to sync with a MySQL database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

// Creates the connection with the server and loads the product data upon a successful connection
connection.connect(function (err) {
  if (err) {
    console.error("connected as id: " + connection.threadId);
  }
  products();
});


// Function to load the products table from the database and print results to the console
function products() {
  // Selects all of the data from the MySQL products table
  connection.query("SELECT * FROM products", function (err, res) {

    if (err) throw err;
    // create table for products
    const table = new Table({
      head: ['item_id', 'product_name', 'department_name', 'price', 'stock_quantity']

    });
    res.forEach(function (data) {
      if (table.length < 15)
        // push colors to database
        table.push([colors.yellow(data.item_id), colors.green(data.product_name), colors.magenta(data.department_name), colors.cyan(data.price), colors.blue(data.stock_quantity)]);

    });
    console.log(table.toString());


    purchargeProducts();

  })

};

//function to ask users which products they would like to buy
function purchargeProducts() {

  //calling the function from within displayProducts() to force a synchronous display

  //i.e. show the products table from the database and then go through inquirer prompts

  inquirer.prompt([

    {

      name: "productChoice",

      type: "input",

      message: "What products would you like to buy? Please enter the corresponding item ID: ",



      //checks if the user input in a index number

      validate: function (message) {

        if (isNaN(message)) {

          return console.log("\nInvalid Response. Please input an index number!!")

        }

        else {

          return true;

        }

      }

    },

    {

      name: "productQuantity",

      type: "input",

      message: "How many items would you like to buy? Please enter: ",



      //checks if user put in a number

      validate: function (message) {

        if (isNaN(message)) {

          return console.log(" Invalid Response. Please input an index number.")

        }

        else {

          return true;

        }

      }

    }

  ])

    .then(function (answers) {


      //compares user's input from productChoice to to item_id in bamazon database

      connection.query("SELECT * FROM products WHERE item_id=?", answers.productChoice, function (err, res) {

        if (err) throw err;

        //console.log(res); //test

        //if the user enters a productChoice that doesn't match an item_id in the database

        if (res.length === 0) {

          console.log("\n The product you entered does not exist in the records, Please try another valid number.");

          console.log("");


          purchargeProducts();

        }

        for (var i = 0; i < res.length; i++) {

          //if the user asked for a larger quantity than what's available in stock

          if (answers.productQuantity > res[i].stock_quantity) {

            // print out valid input
            console.log("\n" + res[i].product_name + " Insufficient quantity Stocks, please Enter another Item or another small number !!");

            console.log(colors.green("Current stocks quantity are: " + res[i].stock_quantity + " Items "));

            console.log("");

         //run inquirer prompts again

            purchargeProducts();

          }

           else {

            //get the total cost of what the user wants to purchase

            var totalCost = res[i].price * answers.productQuantity;

            //Print Out the user Order:

            console.log(colors.green("\n Your Order is: " + res[i].product_name));

            console.log(colors.green(" Your Items Quantity Ordered: " + answers.productQuantity));

            console.log(colors.green(" Your Cost each Unit is:" + " $" + res[i].price.toFixed(2)));

            console.log(colors.green(" Your Total Cost are:" + " $" + totalCost.toFixed(2)));


            // Create update Quantity Stcock in the WareHouse
            var updateQuantity = res[i].stock_quantity - answers.productQuantity;

            //connection with Database stock_quantity
            connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?", [updateQuantity, answers.productChoice], function (err, res) {

              if (err) throw err;

            });
            //connection with Database item_id
            connection.query("SELECT * FROM products WHERE item_id=?", answers.productChoice, function (err, res) {

              if (err) throw err;

              for (var p = 0; p < res.length; p++) {

                //Print out Quantity Update
                console.log("\nNew Stocks Quantity updated !!");

                console.log("New Stocks for : "  + (colors.blue ( " < " + res[p].product_name + " > " )+ " Quantity Updated Now is : " + (colors.blue(res[p].stock_quantity   + " Items left"))));

                console.log("");
                // call back function buyAgain
                buyAgain();

              }

            });
          }

        }

    })

  });

};

//function to ask user if they want to buy another products or end the program

function buyAgain() {

  //called within promise of purchargeProducts() so prompt appears in desired order
  inquirer.prompt([

    {

      name: "buyagain",

      type: "confirm",  //returns boolean response

      message: "Would you like to buy another Item or Product?"

    }

  ])

    .then(function (answers) {

      //console.log(answers);  //test

      if (answers.buyagain) {

        purchargeProducts();

      }

      else {
        // Print out if user stop buy Item 
        console.log("Thank you for shopping at Bamazon! See you Again !!");
        // connection end
        connection.end();

      }

    });

}