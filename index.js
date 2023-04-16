const inquirer = require("inquirer");
const db = require('./server');
// const consoleTable = require("console.table");

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
        db.query("SELECT id, name FROM department", (err, rows) => {
          if (err) {
            console.log(err);
            return;
          }
          console.table(rows);
        });
        break;

      case "View all roles":
        db.query(
          "SELECT role.id, role.title, role.salary, department.name AS department_name FROM role INNER JOIN department ON role.department_id = department.id",
          (err, rows) => {
            if (err) {
              console.log(err);
              return;
            }
            console.table(rows);
          }
        );
        break;

      case "View all employees":
        db.query(
          'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department_name, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager_name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id',
          (err, rows) => {
            if (err) {
              console.log(err);
              return;
            }
            console.table(rows);
          }
        );
        break;

      case "Add a department":
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
              }
            );
          });
        break;

      case "Add a role":
        // First, prompt the user for the role information
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
            // Then, execute an INSERT query to add the role to the database
            db.query(
              "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
              [answer.title, answer.salary, answer.department_id],
              (err, result) => {
                if (err) {
                  console.log(err);
                  return;
                }
                console.log(`Added ${answer.title} role to the database.`);
              }
            );
          });
        break;

      case "Add an employee":
        // prompt user for employee information
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
              choices: roleChoices, // roleChoices is an array of role titles from the database
            },
            {
              type: "list",
              name: "manager",
              message: "Who is the employee's manager?",
              choices: managerChoices, // managerChoices is an array of employee names from the database
            },
          ])
          .then((answers) => {
            // get the role id for the selected role
            const roleId = roleIds[roleChoices.indexOf(answers.role)];
            // get the employee id for the selected manager
            const managerId =
              managerIds[managerChoices.indexOf(answers.manager)];
            // insert the new employee into the database
            db.query(
              `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
                VALUES (?, ?, ?, ?)`,
              [answers.first_name, answers.last_name, roleId, managerId],
              (err, result) => {
                if (err) throw err;
                console.log(
                  `Added ${answers.first_name} ${answers.last_name} to the database.`
                );
              }
            );
          });
        break;

        case "Update an employee role":
          // Step 1: Display a list of all employees with their current roles
          const employeesSql = `
            SELECT employee.id, employee.first_name, employee.last_name, role.title
            FROM employee
            INNER JOIN role ON employee.role_id = role.id
          `;
          db.query(employeesSql, (err, results) => {
            if (err) {
              console.log(err);
              return;
            }
            console.table(results);
        
            // Step 2: Prompt the user to select an employee to update
            inquirer.prompt([
              {
                type: "input",
                name: "employeeId",
                message: "Enter the ID of the employee you want to update:",
                validate: function (input) {
                  const employeeIds = results.map(result => result.id);
                  if (employeeIds.includes(parseInt(input))) {
                    return true;
                  }
                  return "Please enter a valid employee ID.";
                }
              }
            ]).then(employeeAnswers => {
              const employeeId = employeeAnswers.employeeId;
        
              // Step 3: Display a list of all roles to select from
              const rolesSql = `
                SELECT id, title, salary, department_id
                FROM role
              `;
              db.query(rolesSql, (err, results) => {
                if (err) {
                  console.log(err);
                  return;
                }
                console.table(results);
        
                // Step 4: Prompt the user to select a new role for the employee
                inquirer.prompt([
                  {
                    type: "input",
                    name: "roleId",
                    message: "Enter the ID of the new role for the employee:",
                    validate: function (input) {
                      const roleIds = results.map(result => result.id);
                      if (roleIds.includes(parseInt(input))) {
                        return true;
                      }
                      return "Please enter a valid role ID.";
                    }
                  }
                ]).then(roleAnswers => {
                  const roleId = roleAnswers.roleId;
        
                  // Step 5: Update the employee's role in the database
                  const updateSql = `
                    UPDATE employee
                    SET role_id = ?
                    WHERE id = ?
                  `;
                  db.query(updateSql, [roleId, employeeId], (err, result) => {
                    if (err) {
                      console.log(err);
                      return;
                    }
                    console.log(`Employee's role has been updated.`);
        
                    // Step 6: Return to the main menu
                    mainMenu();
                  });
                });
              });
            });
          });
          break;
        
  }})
  .catch((error) => {
    console.log(error);
  });
