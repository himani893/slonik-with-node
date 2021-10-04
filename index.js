
import { config } from "dotenv";
import {USER_TABLE, ADD_USER_TEXT, DB_ERROR_CODE, SUCCESS_CODE} from "./config.js";

import pkg from 'restify';
import {
  createPool,
  sql,
  SlonikError
} from 'slonik';
config();

const {DB_CLIENT, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME, POOL_SIZE, PORT} = process.env;
const server = pkg.createServer();
server.use(pkg.plugins.bodyParser());
server.use(pkg.plugins.queryParser());

const clientConfiguration = {
  maximumPoolSize: POOL_SIZE,
  preferNativeBindings: true,
  captureStackTrace: false,
};


// will make it at common place
console.log(DB_CLIENT, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME, POOL_SIZE)
const pool = createPool(`${DB_CLIENT}://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`, clientConfiguration);


pool.connect((connection) => {
    // You are now connected to the database.
    console.log(pool.getPoolState()); //idleConnection will be 1
    return;    
})
.then(() => {
  console.log(pool.getPoolState()); // idleConnection will be 0
})
.catch((e) => {
  pool.end();
});


// get users list  
server.get('/users', async function getUsers(req, res) {
    let sqlQuery = ``;
    const params = [];
    if (req.query.name) {
      // sqlQuery += `WHERE name = $1 `;
      params.push(req.query.name)
    }
    try {
      const users = await pool.anyFirst(sql`SELECT email, name, "phoneNumber" FROM ${sql.identifier([USER_TABLE])} WHERE name ILIKE ${req.query.name}`);
        // pool.query() returns as below format response, rows property gives expected output
        // {
        //   command: 'SELECT',
        //   fields: [],
        //   notices: [],
        //   rowCount: 1,
        //   rows: [
        //     {
        //       name: 'demo',
        //       email: 'demo@example.com',
        //       phoneNumber: "7894561236"
        //     }
        //   ]
        // }
        // pool.many() returns `NotFoundError: Resource not found.` If query returns no rows.
        // pool.anyFirst() returns `DataIntegrityError: Query returns an unexpected result` because we are selecting multiple columns
        return res.send(SUCCESS_CODE, {data: users.rows}); //pool.any() returns only one array element
    } catch (error) {
      if (error instanceof SlonikError) {
        // This error is thrown by Slonik.
        return res.send(DB_ERROR_CODE, {error: error.message})
      }
    }
    
});

// create user
server.post('/users', async function addUser(req, res) {
  const {email, name, password, phoneNumber} = req.body;
  const keys = {
    'email': 'varchar',
    'name': 'varchar',
    'password': 'varchar', 
    'phoneNumber': 'varchar'
  };
  const identifiers = Object.keys(keys).map((key) => {
    return sql.identifier([key]);
  });
  const values = [
    [email, name, password, phoneNumber] // single full record
  ];
  const query = sql`
    INSERT INTO ${sql.identifier([USER_TABLE])}
      (${sql.join(identifiers, sql`, `)})
    SELECT * FROM
      ${sql.unnest(values, Object.values(keys))}
    RETURNING *
  `;
  await pool.query(query);
  return res.send(SUCCESS_CODE, ADD_USER_TEXT);
});


server.listen(PORT, function() {
  console.log('%s listening at %s', server.name, server.url);
});