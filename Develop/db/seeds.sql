USE business_db;

INSERT INTO department (name) VALUES ('Sales');
INSERT INTO department (name) VALUES ('Marketing');
INSERT INTO department (name) VALUES ('Engineering');
INSERT INTO department (name) VALUES ('Human Resources');

INSERT INTO role (title, salary, department_id) VALUES ('Sales Manager', 75000, 1);
INSERT INTO role (title, salary, department_id) VALUES ('Sales Representative', 50000, 1);
INSERT INTO role (title, salary, department_id) VALUES ('Marketing Manager', 80000, 2);
INSERT INTO role (title, salary, department_id) VALUES ('Marketing Coordinator', 40000, 2);
INSERT INTO role (title, salary, department_id) VALUES ('Lead Engineer', 100000, 3);
INSERT INTO role (title, salary, department_id) VALUES ('Software Engineer', 75000, 3);
INSERT INTO role (title, salary, department_id) VALUES ('Human Resources Manager', 90000, 4);
INSERT INTO role (title, salary, department_id) VALUES ('Human Resources Generalist', 50000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('John', 'Doe', 1, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Jane', 'Doe', 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Alice', 'Johnson', 2, 1);
