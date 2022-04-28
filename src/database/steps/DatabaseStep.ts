import test from "@playwright/test";
import { IRecordSet } from "mssql";
import Assert from "@asserts/Assert";
import DBUtil from "@utils/DBUtil";
import DatabaseConstants from "@dbConstants/DatabaseConstants";

export default class DatabaseStep {
    public async executeMSSQLQuery(query: string) {
        let result: { rows: IRecordSet<any>; rowsAffected: number[]; };
        await test.step('Executing query in MS SQL db', async () => {
            result = await DBUtil.executeMSSQLQuery(process.env.DB_CONFIG, query);
            console.log(result);
        });
        return result;
    }

    public async executeDB2Query(query: string) {
        let result: { rows: any; rowsAffected: any; };
        await test.step('Executing query in DB2 db', async () => {
            result = await DBUtil.executeDB2Query(process.env.DB_CONFIG, query);
            console.log(result);
        });
        return result;
    }

    public async executeOracleQuery(query: string) {
        let result: { rows: unknown[]; rowsAffected: number; };
        await test.step('Executing query in Oracle db', async () => {
            result = await DBUtil.executeOracleQuery(process.env.DB_CONFIG, query);
            console.log(result);
        });
        return result;
    }

    public async verifyExecutionSuccess(rowsAffected: number) {
        await test.step('Verify query execution is success', async () => {
            await Assert.assertTrue(rowsAffected > 0, DatabaseConstants.QUERY_EXECUTION);
        });
    }
}
