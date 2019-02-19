-- Drops the animals_db if it exists currently --
DROP DATABASE IF EXISTS bamazon;
-- Creates the "animals_db" database --
CREATE DATABASE bamazon;

-- Makes it so all of the following code will affect animals_db --
USE bamazon;
-- Creates the table "people" within animals_db --
CREATE TABLE products(
-- Creates a numeric column called "item_id" which will automatically increment its default value as we create new rows --
  item_id INT AUTO_INCREMENT NOT NULL,
  -- Makes a string column called "product_name" which cannot contain null --
  product_name VARCHAR(50) NOT NULL,
  -- Makes a string column called "department_name" 
  department_name VARCHAR(50) NOT NULL,
  -- Makes a format column call "price"
  price DECIMAL(10,2) NOT NULL,
  -- Makes an numeric column called "stock_quantity" -
  stock_quantity INT(10) NOT NULL,
  -- Sets id as this table's primary key which means all data contained within it will be unique --
  primary key(item_id)
);

SELECT * FROM products;

-- Creates new rows containing data in all named columns --
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 
  ("sketchbook", "Art Supplies", 20.50, 30),
  ("junoir dress", "Apparel", 25.00, 25),
  ("bananas", "Produce", 12.00, 25),
  ("Strawbery", "Produce", 5.75, 25),
  ("Love", "Films", 20.00, 50),
  ("Battle Angle", "Films", 29.50, 57),
  ("Hasbro", "Kids Games", 29.99, 55),
  ("Monopoly", "Kids Games", 29.95, 25),
  ("Assassins", "Video Games", 39.95, 200),
  ("Fortnire", "Video Games", 49.99, 200);