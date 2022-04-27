/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import * as sql from "mssql";
import oracledb from "oracledb";
import CommonConstants from "../constants/CommonConstants";
import DBConstants from "../constants/DBConstants";

export default class DBUtil {
  /**
   * Executes the query on MSSQL database
   * @param dbConfig data base configuration
   * @param query to be executed
   * @returns record set
   */
  public static async executeMSSQLQuery(dbConfig: string, query: string) {
    try {
      const pool = await sql.connect(`${dbConfig}${DBConstants.CERTIFICATE}`);
      const result = await pool.request().query(query);
      return { rows: result.recordset, rowsAffected: result.rowsAffected };
    } catch (err) {
      throw new Error(`Error while executing query\n${err.message}`);
    }
  }

  /**
   * Executes the query on Oracle database
   * @param dbConfig data base configuration
   * @param query to be executed
   * @returns record set
   */
  public static async executeOracleQuery(dbConfig: string, query: string) {
    const configs = dbConfig.split(CommonConstants.SEMICOLON);
    const config = {
      user: configs[0].replace(DBConstants.USER, CommonConstants.BLANK).trim(),
      password: configs[1].replace(DBConstants.PASSWORD, CommonConstants.BLANK).trim(),
      connectString: configs[2].replace(DBConstants.CONNECTION_STRING, CommonConstants.BLANK).trim(),
    };
    let connection: oracledb.Connection;
    try {
      connection = await oracledb.getConnection(config);
      const result = await connection.execute(query);
      return { rows: result.rows, rowsAffected: result.rowsAffected };
    } catch (err) {
      throw new Error(`Error while executing query\n${err.message}`);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

  /**
   * Executes the query on DB2 database
   * @param dbConfig data base configuration
   * @param query to be executed
   * @returns record set
   */
  public static async executeDB2Query(dbConfig: string, query: string) {
    const ibmdb = require('ibm_db');
    let connection: any;
    try {
      connection = ibmdb.openSync(`${dbConfig}${DBConstants.PROTOCOL}`);
      const result = connection.querySync(query);
      return { rows: result, rowsAffected: result.length };
    } catch (error) {
      throw new Error(`Error while executing query\n${error.message}`);
    } finally {
      if (connection) {
        try {
          connection.closeSync();
        } catch (err) {
          console.error(err);
        }
      }
    }
  }
}
