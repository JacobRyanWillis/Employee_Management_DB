const inquirer = require("inquirer");
const consoleTable = require('console.table');

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
        // code to view all departments
        break;
      case "View all roles":
        // code to view all roles
        break;
      case "View all employees":
        // code to view all employees
        break;
      case "Add a department":
        // code to add a department
        break;
      case "Add a role":
        // code to add a role
        break;
      case "Add an employee":
        // code to add an employee
        break;
      case "Update an employee role":
        // code to update an employee's role
        break;
      default:
        console.log("Invalid choice");
    }
  })
  .catch((error) => {
    console.log(error);
  });
