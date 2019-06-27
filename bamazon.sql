CREATE DATABASE bamazon;

USE bamazon; 

CREATE TABLE inventory(
	itemid int auto_increment not null, 
    productname varchar(45) not null,
    department varchar(45) not null, 
    price decimal(10,4) not null, 
    stockquantity int(10) not null, 
    primary key(itemid)
);

insert into inventory(productname, department, price, stockquantity)
values('macbook pro', 'electronics', 1499, 15),
('apple pencil', 'electronics', 99, 100),
('sous vide', 'kitchen', 169, 50),
('non-stick pan', 'kitchen', 20, 100),
('stools', 'furniture', 40, 20),
('couch', 'furniture', 5000, 10),
('soccer ball', 'sports', 50, 10),
('basketball shorts', 'sports', 50, 100),
('high hills', 'fashion', 100, 100),
('spring dress', 'fashion', 100, 100);