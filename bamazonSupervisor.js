var inquirer = require('inquirer');
var sql = require('mysql');
const cTable = require('console.table');

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

            connection.query('SELECT * FROM departents', function(err, res){
                const report = res
                for (var i = 0; i < report.length; i ++){
                    report[i].profit = report[i].product_sales - report[i].overhead_cost
                }
                console.table(report);
            })
            supervisorMenu()
                

        }
        else{
            createNewDepartment();
        }
    })
}

const createNewDepartment = function(){
    inquirer.prompt([
        {
            type: 'input',
            message: "Enter the department name",
            name: "deptName"
        },
        {
            type: 'input',
            message: "Enter the department overhead cost",
            name: "deptCost"
        }
    ]).then(function(res){
        connection.query(`INSERT INTO departents (department_name, overhead_cost, product_sales) VALUES (?)`,[
            {
                department_name: res.deptName,
                overhead_cost: res.deptCost,  
                product_sales: 0
            }
        ], function(err, res){
            if (err) throw err;
        })
        supervisorMenu();
    })
    
    
}