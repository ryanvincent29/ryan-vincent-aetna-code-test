const SqliteDatabase = require("better-sqlite3");
const config = require("config");

class Database {
  #databaseConnection;

  constructor() {
    try {
      //TODO: Allow limited configuration from initilization?
      this.#databaseConnection = new SqliteDatabase(
        config.get("database.primaryDatabaseFile"),
        {
          readonly: true,
          fileMustExist: true,
          timeout: 5000,
          verbose: console.debug,
        }
      );
      // I don't 100% love how I am doing this, but I am not sure the best way to make a single
      // SQLITE connection to allow for joins when we have a separate DB file for each entity.
      const secondaryDatabases = config.get("database.secondaryDatabaseFiles");
      for (let i = 0; i < secondaryDatabases.length; i++) {
        const curDb = secondaryDatabases[i];
        this.#databaseConnection.exec(
          `ATTACH DATABASE '${curDb.path}' as ${curDb.alias};`
        );
      }
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * 
   * @param {string} sql - Parameterized sql statement
   * @param {array} paramsArray - Array of parameters to inject into SQL
   * @returns - All items that match the given query
   */
  async runQueryAll(sql, paramsArray) {
    return await this.#databaseConnection.prepare(sql).all(...paramsArray);
  }

  /**
   * 
   * @param {string} sql - Parameterized sql statement
   * @param {array} paramsArray - Array of parameters to inject into SQL
   * @returns - A single item that matches the given query
   */
  async runQuerySingle(sql, paramsArray) {
    return await this.#databaseConnection.prepare(sql).get(...paramsArray);
  }
}

module.exports = Database;
