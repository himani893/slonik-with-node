# slonik-with-node


# Migrations

- To [create] migration files, Command -> `node migrate create --name users.sql`
- To run [up] migrations - `node migrate up`
- To run [down] migrations - `node migrate down`
- To run [pending] migrations - `node migrate pending`
- To print the list of migrations that have already been [applied]- `node migrate executed`
- `node migrate up --name m1.sql --name m2.sql` # runs only m1.sql and m2.sql. Throws if they aren't pending.


# migrations Directory (Down, Up files)

- Up migration requires SQL queries, i.e create table, create index, create contraints
- Down migration requires SQL queries, but for failed behaviour i.e drop table, remove index, remove contraints


# Slonik encourages for raw SQL queries
- i.e   pool.query(sql `SELECT email,name,password,"phoneNumber" from users`).then((users) => {
            console.log(users.rows);
        });

# It runs bulk queries too using transaction method.
  i.e   pool.transaction(async (transactonConnection) => {
            await transactionConnection.query(sql`INSERT INTO foo (bar) VALUES ('baz')`);
            await transactionConnection.query(sql`INSERT INTO qux (quux) VALUES ('quuz')`);
        });  