import { SlonikMigrator } from "@slonik/migrator";
import { createPool } from "slonik";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { config } from "dotenv";

config();

const {DB_CLIENT, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME} = process.env;


(function() {

  // pass db connection details to create a pool
  const pool = createPool(`${DB_CLIENT}://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`);

  try {
      // migrator arg
      const migrator = new SlonikMigrator({
        migrationsPath: dirname(fileURLToPath(import.meta.url)) + '/migrations',
        migrationTableName: 'migration',
        slonik: pool,
      });
      migrator.runAsCLI(); // it will create sql file and inside down folder for given path, example:: node migrate create --name users.sql
  } catch (e) {
    console.log(e);
  }
})();
