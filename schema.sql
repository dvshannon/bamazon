DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(45) NULL,
    department_name VARCHAR(45) NULL,
    price FLOAT(15)NULL,
    stock_quantity INT NULL,
    PRIMARY KEY(item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Ryzen 5 1600", 'pc', 164.99, 12),
("Seagate 1TB HDD", 'pc', 44.99, 8),
("Apple Airpods", 'music', 165.99, 2),
("Poptarts", 'food', 2.49, 9),
("JIF Creamy Peanut Butter", 'food', 5.99, 16),
("Sauvage by Dior", 'accesories', 64.99, 1),
("Rayban Wayfarers", 'accesories', 135.10, 7),
("Nike SB Dunk High", 'shoes', 64.99, 3),
("Patagonia Fleece", 'clothing', 83.49, 19),
("Crocs", 'shoes', 30.99, 11),
("Volcom Chino Khakis", 'clothing', 44.99, 4),
("Spotify gift card", 'music', 20, 25);