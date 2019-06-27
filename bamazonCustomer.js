var inquirer = require('inquirer');
var sql = require('mysql');

var connection = sql.createConnection({
    host: 'localhost',
    post: 3306,
    user: 'root',
    password: 'password',
    database: 'bamazon'

});

connection.connect(function(err){
    if (err) throw err;
    showProducts()
})

const showProducts = function(){
    connection.query('SELECT * FROM inventory', function(err, res){
        for(var i = 0; i < res.length; i ++){
            console.log(res[i].itemid+ ' || '+res[i].productname+' || ' + res[i].department)
        }
        askClient();
    })
   
}

const askClient = function(){
    inquirer.prompt([
        {
            type: 'input',
            message: 'what is the id of the product that you would like to buy?',
            name: 'itemid'
        },
        {
            type: 'input',
            message: 'how many would you like to buy?',
            name: 'quantity'
        }
    ]).then(function(userRequest){
        connection.query('SELECT * FROM inventory', function(err, res){
            var quantityDesired = parseInt(userRequest.quantity);
            var quantityInInventory;
            var productDesired = parseInt(userRequest.itemid);
            var productSale;
            var total; 



            for (var i = 0; i < res.length; i ++){
                if (res[i].itemid === productDesired){
                    quantityInInventory =res[i].stockquantity;
                    if(isNaN(res[i].product_sale)){
                        productSale = 0

                    }
                    else {
                        productSale = res[i].product_sale;
                    }

                    
                    if(quantityDesired < quantityInInventory){
                        total = quantityDesired*res[i].price;
                        productSale+=total;                        
                        console.log('The total of your order will be '+ productSale);
                        // console.log(productSale);
                        inquirer.prompt([
                            {
                                type: 'confirm',
                                message: 'Do you want to make the purchase?',
                                name: 'confirmation'
                            }
                        ]).then(function(confirmation){
                         
                            if (confirmation.confirmation){
                                quantityInInventory-=quantityDesired;

                                connection.query(`UPDATE inventory SET stockquantity=${quantityInInventory}, product_sale=${productSale} WHERE ?`,[
                                    {
                                        itemid: productDesired 
                                    }
                                ],function(err, res) {
                                    if (err) throw err;
                                    
                                    
        
                                })
                               
                            }
                            else{
                                console.log('Sorry, not enough inventory');
                            }

                            
                        })
                    }
    
                }
            }   
        }) 
    })
}

