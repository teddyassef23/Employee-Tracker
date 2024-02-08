
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

  return rows;


}
async function getDepartment() {
  const conn = await mysqlpromise.createConnection({
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'root',
    database: 'employee_db'
  });
  const [rows] = await conn.execute('select * from  department');
  await conn.end();

  return rows;
}
async function getEmployee() {
  const conn = await mysqlpromise.createConnection({
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'root',
    database: 'employee_db'
  });
  const [employees] = await conn.execute('select * from  employee');
  await conn.end();

  return employees;
}



async function getManager() {
  const conn = await mysqlpromise.createConnection({
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'root',
    database: 'employee_db'
  });
  const [rows] = await conn.execute('SELECT * FROM employee where id in (SELECT distinct  manager_id from employee)');
  await conn.end();

  return rows;
}


function viewAllEmployees() {



  db.query('SELECT * FROM employee', function (err, results) {
    console.log(results);
  });



}


  // INSERT INTO role (title, salary, department_id) VALUES('Accounting', 1000 , 3);

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


async function addRole(){
 let departmantsName;
 let departmants;


 await getDepartment()
    .then((results) => {
      departmants = results;
      departmantsName = results.map(({id, name }) => { return  name });
  //  console.log(departmantsName);
    });
 


    const questionsDepartment = [   
       {
        type: "input",
        name: "postion",
        message: "The Title of the postion?",
      },
       {
        type: "input",
        name: "salary",
        message: "The Salary of the postion?",
      
      },
      
       {
        type: "list",
        name: "departmant",
        message: "What is the Title of the departmant ?",
        choices: departmantsName
      }
         
     
    
  
    ];


  // console.log(departmants);
  // console.log(departmantsName);

  
   answers = await inquirer.prompt(questionsDepartment);
   const department_id = departmants.filter((departmant) => departmant['name'] === answers.departmant).map((departmant) => departmant['id']);

console.log( department_id[0]);

  db.query(`INSERT INTO role (title, salary, department_id) VALUES('${answers.postion}',${answers.salary} , ${department_id[0]}) `,
  async function (err, results) {

    
  });
}


async function addNewEmployee() {
  let roles ;
  let titles;
  let managers;
  let managerNames


await getRoles()
    .then((resalets) => {
      roles = resalets;
        titles = resalets.map(({ id, title }) => {
          return  title });
    });

await getManager()
    .then((results) => {
      managers = results;
      managerNames = results.map(({ id,frist_name, last_name  }) => {
          return frist_name  +' ' + last_name  });
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
      choices: titles 
    },
    {
      type: "list",
      name: "managerFullName",
      message: "Who is employee manager's Name?",
      choices: managerNames 
    }

  ];

  
  let answers = await inquirer.prompt(questions);

  const roleId = roles.filter((role) => role['title'] === answers.role).map((role) => role['id']);
  const managerId = managers.filter((manager) => manager['frist_name'] + ' ' + manager['last_name'] == answers.managerFullName).map((manager) => manager['id']);

   


  db.query(`INSERT INTO employee (frist_name, last_name, role_id, manager_id) VALUES('${answers.frist_name}','${answers.last_name}',${roleId[0]},${managerId[0]}) `,
   async function (err, results) {
    if (err) console.error(err);
   });


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
        await addRole();
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
