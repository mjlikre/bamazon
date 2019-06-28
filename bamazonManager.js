var inquirer = require('inquirer');
var mysql  = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    post: 3306,
    user: 'root',
    password: 'password',
    database: 'bamazon'
});

connection.connect(function(err){
    if (err) throw err;
    manager();
})

const manager = function (){
    inquirer.prompt([
        {
            type: 'list',
            choices: ['View Producs for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product',"Exit"],
            name: 'managerChoice'
        }
    ]).then(function(res){
        if (res.managerChoice === 'View Producs for Sale'){
            getProducts();
        }
        else if(res.managerChoice === 'View Low Inventory'){
            getLowInventory();

        }
        else if (res.managerChoice === "Add to Inventory"){
            addToInventory();
        }
        else if(res.managerChoice === "Add New Product"){
            addNewProduct();
        }
        else if(res.managerChoice === 'Quit'){
            process.exit();
        }
    })
}

const getProducts = function(){
    connection.query("SELECT * FROM inventory", function(err, res){
        for (var i = 0; i < res.length; i ++){
            console.log(res[i].itemid+" || "+res[i].productname+' || '+res[i].price + ' || '+ res[i].stockquantity);
        }
        manager();
    })
}

const getLowInventory = function(){
    const lowInventory = [];
    connection.query('SELECT * FROM inventory', function(err, res){
        for (var i = 0; i < res.length; i ++){
            if(res[i].stockquantity<=15){
                lowInventory.push(res[i]);
            }
        }
        for (var i = 0; i < lowInventory.length; i ++){
            console.log(lowInventory[i].productname + ' || '+lowInventory[i].stockquantity);
        }
        manager();
    })
    
}

const addToInventory = function (){
    connection.query('SELECT * FROM inventory', function(err, res){
        
        inquirer.prompt([
            {
                type : 'list',
                name: 'productsToAdd',
                choices: function(){
                    var arr = [];
                   
                    for (var i = 0 ; i < res.length; i ++){
                        arr.push(res[i].productname)
                    }
                    return arr;
                
                }
            },
            {
                type: 'input',
                message: 'How many items would you like to add?',
                name: 'toAdd'
            }
        ]).then(function(productsToAdd){
            var item = productsToAdd.productsToAdd;
            var currentQuantity;
            var quantityToAdd = parseInt(productsToAdd.toAdd);
            for(var i = 0; i < res.length; i ++){
                if(res[i].productname === item){
                    currentQuantity = res[i].stockquantity + quantityToAdd;
                    
                    connection.query('UPDATE inventory SET ? WHERE ?',[
                        {
                            stockquantity: currentQuantity
                        },
                        {
                            productname: item
                        }
                    ]),function(err, result){
                        if (err) throw err;

                        console.log('Inventory updated!');
                        
                    }
                }  
            }
        });
    });
    
}

const addNewProduct = function(){
    inquirer.prompt([
        {
            type: 'input',
            message: 'Enter the product name that you want to add: ',
            name: 'newProduct'
        },
        {
            type: 'input',
            message: 'Enter the new product category',
            name: 'newProductCat',
            
        },
        {
            type: 'input',
            message: 'Enter the price for the new product',
            name: 'newProductPrice'
        },
        {
            type: 'input',
            message: 'Enter the quantity that you wish to add',
            name: 'newProductQuantity'
        }
    ]).then(function(res){
        var name = res.newProduct;
        var category = res.newProductCat;
        var price = parseFloat(res.newProductPrice);
        var quantity = parseInt(res.newProductQuantity);
        connection.query('INSERT INTO inventory SET ?',
            {
                productname: name,
                department: category,
                price: price,
                stockquantity: quantity
            },
            function(err, res){
                if (err) throw err;
                console.log(`You've added ${quantity} ${name} into the ${category} department, with the price of ${price} each`)
                manager();
            }
        )
    })
    

}
