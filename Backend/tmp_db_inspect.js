const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  const con = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
  });

  const [rows] = await con.execute(
    'SELECT CONSTRAINT_NAME, TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?',
    [process.env.DB_NAME, 'services']
  );
  console.log('constraints:', JSON.stringify(rows, null, 2));

  const [cols] = await con.execute('SHOW COLUMNS FROM services');
  console.log('columns:', JSON.stringify(cols.map(c => ({ Field: c.Field, Type: c.Type, Null: c.Null, Key: c.Key, Extra: c.Extra })), null, 2));

  await con.end();
})();
