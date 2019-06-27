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
    supervisorMenu()
})

const supervisorMenu = function(){
    inquirer.prompt([
        {
            type: 'list',
            choices: ['View Product Sales by Department', 'Create New Department'],
            name: 'supervisorChoice'
        }
    ]).then(function(res){
        if (res.supervisorChoice === 'View Product Sales by Department'){

            connection.query('SELECT departents.department_id, departents.department_name, departents.overhead_cost, inventory.product_sale FROM departents INNER JOIN inventory ON inventory.department = departents.department_name', function(err, response){
                console.log(response);
            })

        }
        // else{
        //     createNewDepartment();
        // }
    })
}