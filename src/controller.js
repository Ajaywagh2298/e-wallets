import { database } from '../config/config';
import {
  buildWhereClause,
  buildUpdateClause,
  buildJoinClause,
  buildOrderAndLimit,
} from './utils';

// LOGS FIRST to avoid circular ref
export const saveLogs = async (message) => {
  try {
    const errorMessage = typeof message === 'string' ? message : JSON.stringify(message);
    await database.runAsync(
      `INSERT INTO error_log (log_message) VALUES (?);`,
      [errorMessage]
    );
    console.log('✅ Error log saved');
  } catch (error) {
    console.error('❌ Error saving logs:', error);
  }
};

// INSERT
export const insertQuery = async (table, dataObj) => {
  try {
    const keys = Object.keys(dataObj);
    const placeholders = keys.map(() => '?').join(', ');
    const values = Object.values(dataObj);

    const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders});`;
    console.log('📥 Insert SQL:', sql, values);

    const result = database.runSync(sql, values); // No callbacks
    console.log(`✅ Inserted into ${table}, Result:`, result);

    return result;
  } catch (error) {
    await saveLogs(error);
    console.error(`❌ Insert error in ${table}:`, error);
    return null;
  }
};

// UPDATE
export const updateQuery = async (table, updateModel, filterModel = {}) => {
  try {
    const { clause: updateClause, values: updateValues } = buildUpdateClause(updateModel);
    const { clause: whereClause, values: whereValues } = buildWhereClause(filterModel);
    const sql = `UPDATE ${table} SET ${updateClause} ${whereClause}`.trim() + ';';

    await database.runAsync(sql, [...updateValues, ...whereValues]);
    console.log(`✅ Updated ${table}`);
  } catch (error) {
    await saveLogs(error);
    console.error(`❌ Update error in ${table}:`, error);
  }
};

// DELETE
export const deleteQuery = async (table, filterModel = {}) => {
  try {
    const { clause, values } = buildWhereClause(filterModel);
    const sql = `DELETE FROM ${table} ${clause}`.trim() + ';';

    await database.runAsync(sql, values);
    console.log(`✅ Deleted from ${table}`);
  } catch (error) {
    await saveLogs(error);
    console.error(`❌ Delete error in ${table}:`, error);
  }
};

// SELECT
export const selectQuery = async (
  table,
  filterModel = {},
  columns = '*',
  options = {} // { joins: [], orderBy: '', limit, offset }
) => {
  try {
    const { clause: whereClause, values } = buildWhereClause(filterModel);
    const joinClause = buildJoinClause(options.joins || []);
    const extras = buildOrderAndLimit(options);

    const sql = `SELECT ${columns} FROM ${table} ${joinClause} ${whereClause} ${extras}`.trim() + ';';
    const result = database.getAllAsync(sql, values);
    return result || [];
  } catch (error) {
    await saveLogs(error);
    console.error(`❌ Select error in ${table}:`, error);
    return [];
  }
};


export const login = async (name, pin) => {
  await initializeDatabase();
  try {
    const results = await database.getAsync(
      `SELECT * FROM User WHERE name = ? AND pin = ?;`,
      [name, pin]
    );
    console.log('✅ Login Success:', results);
    return results;
  } catch (error) {
    console.error('❌ Error in login:', error);
    return null;
  }
};

export const monthlyExpense = async (month, year) => {

  try {
    const results = await database.getAllAsync(
      `SELECT * FROM expense_details WHERE date BETWEEN ${new Date(year, month - 1, 1).getTime()} AND ${new Date(year, month, 0).getTime()};`,
      [month, year]
    );
    console.log('✅ Monthly Expenses:', results);
    return results || [];
  } catch (error) {
    console.error('❌ Error in monthlyExpses:', error);
    return null;
  }
}