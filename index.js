const inquirer = require("inquirer");
const db = require("./db/connection");
// const consoleTable = require("console.table");

function appMenu() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "menuChoice",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
        ],
      },
    ])
    .then((answers) => {
      switch (answers.menuChoice) {
        case "View all departments":
          viewAllDep();
          break;
        case "View all roles":
          viewAllRoles();
          break;
        case "View all employees":
          viewAllEmploy();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a Role":
          addRole();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update an employee role":
          updateEmployRole();
          break;
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

appMenu();

function viewAllDep() {
  db.query("SELECT id, name FROM department", (err, rows) => {
    if (err) {
      console.log(err);
      return;
    }
    console.table(rows);
    appMenu();
  });
}

function viewAllRoles() {
  db.query(
    "SELECT role.id, role.title, role.salary, department.name AS department_name FROM role INNER JOIN department ON role.department_id = department.id",
    (err, rows) => {
      if (err) {
        console.log(err);
        return;
      }
      console.table(rows);
      appMenu();
    }
  );
}

function viewAllEmploy() {
  db.query(
    'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department_name, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager_name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id',
    (err, rows) => {
      if (err) {
        console.log(err);
        return;
      }
      console.table(rows);
      appMenu();
    }
  );
}

function addDepartment() {
  inquirer
    .prompt({
      type: "input",
      name: "name",
      message: "Enter the name of the department:",
    })
    .then((answer) => {
      db.query(
        "INSERT INTO department (name) VALUES (?)",
        [answer.name],
        (err, result) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log(`Added ${answer.name} department to the database.`);
          appMenu();
        }
      );
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "Enter the name of the role:",
      },
      {
        type: "input",
        name: "salary",
        message: "Enter the salary for the role:",
      },
      {
        type: "input",
        name: "department_id",
        message: "Enter the department ID for the role:",
      },
    ])
    .then((answer) => {
      db.query(
        "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
        [answer.title, answer.salary, answer.department_id],
        (err, result) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log(`Added ${answer.title} role to the database.`);
          appMenu();
        }
      );
    });
}

async function addEmployee() {
  var [roles] = await db.promise().query("SELECT * FROM role");
  var [employee] = await db
    .promise()
    .query(
      "SELECT id, first_name, last_name FROM employee WHERE manager_id IS NULL"
    );
  const managerChoices = employee.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id,
  }));
  const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id,
  }));

  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "What is the employee's first name?",
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the employee's last name?",
      },
      {
        type: "list",
        name: "role",
        message: "What is the employee's role?",
        choices: roleChoices,
      },
      {
        type: "confirm",
        name: "is_manager",
        message: "Is this employee a manager?",
      },
      {
        type: "list",
        name: "manager",
        message: "Who is the employee's manager?",
        choices: managerChoices,
        when: (answers) => answers.is_manager, // Only ask this question if the new employee is a manager
      },
    ])
    .then((answers) => {
      const roleId = roleIds[roleChoices.indexOf(answers.role)];
      let managerId = null;
      if (answers.is_manager) {
        managerId = managerIds[managerChoices.indexOf(answers.manager)];
      }
      db.query(
        `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
        VALUES (?, ?, ?, ?)`,
        [answers.first_name, answers.last_name, roleId, managerId],
        (err, result) => {
          if (err) throw err;
          console.log(
            `Added ${answers.first_name} ${answers.last_name} to the database.`
          );
          appMenu();
        }
      );
    });
}

async function updateEmployRole() {
  try {
    const [employees] = await db.query.promise("SELECT * FROM employee");
    const employeeChoices = employees.map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));

    const [roles] = await db.query.promise("SELECT * FROM role");
    const roleChoices = roles.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    const answers = await inquirer.prompt([
      {
        type: "list",
        message: "Which employee's role do you want to update?",
        name: "employeeId",
        choices: employeeChoices,
      },
      {
        type: "list",
        message: "Which role do you want to assign the selected employee?",
        name: "roleId",
        choices: roleChoices,
      },
    ]);

    await db.query.promise("UPDATE employee SET role_id = ? WHERE id = ?", [
      answers.roleId,
      answers.employeeId,
    ]);

    console.log("Successfully updated employee's role!");
  } catch (err) {
    console.log(err);
  }
}
