
const inquirer = require("inquirer");
const mysql = require('mysql2');
const { Role } = require("./Role");
const mysqlpromise = require('mysql2/promise');


const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'root',
    database: 'employee_db'
  },
  console.log(`Connected to the classlist_db database.`)
);




// Query database

async function getRoles() {
  const conn = await mysqlpromise.createConnection({
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'root',
    database: 'employee_db'
  });
  const [rows, fields] = await conn.execute('select id, title from  role');
  await conn.end();

  console.log(" this is from get ", rows);
  return rows;
}


function viewAllEmployees() {



  db.query('SELECT * FROM employee', function (err, results) {
    console.log(results);
  });



}
function viewAllDepartments() {

  db.query('SELECT * FROM department', function (err, results) {

    console.log('\n\nid\tname');
    console.log('__\t______');
    results.forEach(dep => {
      console.log(dep['id'] + '\t' + dep['name']);
    });



  });


}

async function addDepartment() {
  const questions = [
    {
      type: "input",
      name: "name",
      message: "What is the name of the Department?",
    },

  ];

  answers = await inquirer.prompt(questions);
  let name = answers.name;
  db.query(`INSERT INTO department(name) VALUES('${answers.name}') `,
    async function (err, results) {
      if (err) {

        throw err;
      } else {
        console.log(`Added ${answers.name} to the Database`);

      }
      return;
    });

}


async function addNewEmployee() {
  let roles //= ['IT', 'sales', 'account', 'service'];

  titles =await getRoles()
    .then((resalets) => {
      roles = resalets.map(({ id, title }) => ({ [id]: title }));;
      // titles = resalets.map(( role ) => (role['title'] ));
      console.log("roles  :", roles);
      // console.log("title  :", titles);.map((str) => parseInt(str, 10));

    });


  const questions = [
    {
      type: "input",
      name: "frist_name",
      message: "What is the Frist name of the Employee?",
    },
    {
      type: "input",
      name: "last_name",
      message: "What is the Last name of the Employee?",
    },
    {
      type: "list",
      name: "role",
      message: "What is employee role?",
      choices: roles
    }


  ];
  //   // console.log(" Add new employee : ",roles);

  //    titles = roles.map(( role ) => ( role.title ));
  //  console.log("title colsol :", title);

  // });

  //===================================================

  // db.query('SELECT id, title FROM role ', async function (err, results) {

  //   const titles = results.map(result => result['title']);


  console.log("Add employee titles :", titles);



  let answers = await inquirer.prompt(questions);

  db.query(`INSERT INTO employee (frist_name, last_name, role_id, manager_id)) VALUES('${answers.frist_name}','${answers.last_name}','${answers.title_name}','${answers.manager_name}') `, async function (err, results) { });


  //   db.query (`INSERT INTO employee (frist_name, last_name,role_id, manager_id) VALUES('${answers.frist_name}', '${answers.last_name}', '${departnemts}','${answers.manager_name}') `, 

  //   async function (err, results){ 


}

async function viewAllRole() {



  db.query('SELECT r.id, r.title, r.salary, d.name as department FROM role r join department d on r.department_id = d.id ',
    async function (err, results) {
      console.log('\n\n' + format('id') + format('title') + format('department') + format('salary'));
      console.log(format('--') + format('----') + format('-------') + format('------'));
      results.forEach(role => {
        console.log(format(role['id'])
          + format(role['title'])
          + format(role['department'])
          + role['salary']
        );
      });

    });

}

async function fetchRoles() {
  return db.query('SELECT r.id, r.title, r.salary, d.name as department FROM role r join department d on r.department_id = d.id ',
    async function (err, results) {
      let roles = results.map(role => {
        return new Role(role['id'], role['title'], role['salary'])
      });
      console.log(JSON.stringify(roles));
      return roles;
    });
  //return roles;


}


function format(value, length = 20) {


  return ('' + value).padEnd(length, ' ');
}

const questions = [
  // {
  // 	type: "input",
  // 	name: "text",
  // 	message: "TEXT: Enter up to (3) Characters:",
  // },

  {
    type: "list",
    name: "main_menu",
    message: "What you do Like to do?",
    choices: ["view all departments",
      "view all roles",
      "view all employees",
      "add a department",
      "add a role",
      "Add New Employee",
      "update an employee role",
      "quit"]
  },
];


async function create() {
  let answers;

  do {
    answers = await inquirer.prompt(questions);
    // console.log(answers);

    switch (answers.main_menu) {
      case "view all departments":
        viewAllDepartments();

        break;

      case "view all roles":
        viewAllRole();
        break;
      case "view all employees":
        viewAllEmployees();
        break;
      case "add a department":
        await addDepartment();
        break;
      case "add a role":
        break;
      case "Add New Employee":
        await addNewEmployee();
        break;
      case "update an employee role":
        break;
      case "quit": process.exit();

    }
  } while (answers.main_menu !== 'quit') {

  }


};

create();
