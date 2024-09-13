import mysql2 from 'mysql2';

// Create a connection pool (adjust the configuration as needed)
const pool = mysql2.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'test'
});

export default pool;




/*
"C:\Program Files\MySQL\MySQL Server 8.3\bin\mysql" -u root -p 

*/