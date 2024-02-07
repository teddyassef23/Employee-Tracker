DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;


CREATE Table department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY(id)
);


CREATE Table role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT,
 Foreign Key (department_id) REFERENCES department (id),
  PRIMARY KEY(id)
);



CREATE Table employee (
  id INT NOT NULL AUTO_INCREMENT ,
  frist_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  manager_id INt,
 Foreign Key (role_id) REFERENCES role (id),
  Foreign Key (manager_id) REFERENCES employee (id),
   PRIMARY KEY(id)
);

