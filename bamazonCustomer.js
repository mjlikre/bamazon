var inquirer = require('inquirer');
var sql = require('mysql');

var connection = sql.createConnection({
    host: 'localhost',
    post: 3306,
    user: 'root',
    password: 'password',
    database: 'bamazon'

});


connection.connect(function (err) {
    if (err) throw err;
    showProducts()


})



const showProducts = function () {
    connection.query('SELECT * FROM inventory', function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].itemid + ' || ' + res[i].productname + ' || ' + res[i].department)
        }
        askClient();
    })

}

var productSale;
var total;
var product;


const askClient = function () {
    inquirer.prompt([
        {
            type: 'input',
            message: 'what is the id of the product that you would like to buy?[Quit with Q]',
            name: 'itemid'
        },
        {
            type: 'input',
            message: 'how many would you like to buy?',
            name: 'quantity'
        }
    ]).then(function (userRequest) {
        connection.query('SELECT * FROM inventory', function (err, res) {
            var quantityDesired = parseInt(userRequest.quantity);
            var quantityInInventory;
            var productDesired = parseInt(userRequest.itemid);
            if (userRequest.itemid.toUpperCase()==='Q'){
                process.exit();

            }
            for (var i = 0; i < res.length; i++) {
                if (res[i].itemid === productDesired) {
                    quantityInInventory = res[i].stockquantity;
                    if (quantityDesired < quantityInInventory) {
                        total = quantityDesired * res[i].price;
                        product = res[i].department
                        console.log(product);

                        console.log('The total of your order will be ' + total);

                        inquirer.prompt([
                            {
                                type: 'confirm',
                                message: 'Do you want to make the purchase?',
                                name: 'confirmation'
                            }
                        ]).then(function (confirmation) {


                            if (confirmation.confirmation) {
                                quantityInInventory -= quantityDesired;

                                connection.query(`UPDATE inventory SET stockquantity=${quantityInInventory} WHERE ?`, [
                                    {
                                        itemid: productDesired
                                    },

                                ], function (err, res) {
                                    if (err) throw err;

                                })
                                updateDepartmentTable();

                            }
                            else {
                                console.log('Sorry, not enough inventory');
                                showProducts()
                            }



                        })
                    }

                }
            }

        })
    })
}

const updateDepartmentTable = function () {
    connection.query('SELECT * FROM departents', function (err, res) {


        for (var i = 0; i < res.length; i++) {
            if (product === res[i].department_name) {
                productSale = res[i].product_sales
                productSale += total;
                var query = connection.query('UPDATE departents SET ? WHERE ?', [
                    {
                        product_sales: productSale
                    },
                    {
                        department_name: product
                    }
                ], function (err, final) {
                    if (err) throw err;
                    console.log(query.sql)
                })
            }

        }
        showProducts()
    })
}

