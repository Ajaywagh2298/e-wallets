import * as Crypto from 'expo-crypto';

import { encode as btoa } from 'base-64';
import { decode as atob } from 'base-64';
import { SECURE_FILE_EXT } from '../config/config';

export const encrypt = async (text) => {
    const hmac = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        SECURE_FILE_EXT + text
    );
    const encoded = btoa(`${text}:${hmac}`);
    return encoded;
};

export const decrypt = async (cipher) => {
    try {
        const decoded = atob(cipher);
        const [originalText, originalHmac] = decoded.split(':');

        const currentHmac = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            SECURE_FILE_EXT + originalText
        );

        if (currentHmac === originalHmac) {
            return originalText;
        } else {
            throw new Error('Invalid or tampered data');
        }
    } catch (error) {
        console.error('❌ Decryption failed:', error);
        return null;
    }
};

export const buildWhereClause = (filterModel = {}) => {
    const keys = Object.keys(filterModel);
    if (keys.length === 0) return { clause: '', values: [] };

    const clauseParts = [];
    const values = [];

    keys.forEach(key => {
        const { value, filter, dataType } = filterModel[key];
        let condition = '';

        const isText = dataType === 'text';
        const placeholders = dataType == 'json' ? value.map(() => '?').join(', ') : '?';

        switch (filter) {
            case 'in':
                condition = `${key} IN (${placeholders})`;
                values.push(...value);
                break;
            case 'equal':
                condition = `${key} = ?`;
                values.push(value);
                break;
            case 'gt':
                condition = `${key} > ?`;
                values.push(value);
                break;
            case 'ge':
                condition = `${key} >= ?`;
                values.push(value);
                break;
            case 'lt':
                condition = `${key} < ?`;
                values.push(value);
                break;
            case 'le':
                condition = `${key} <= ?`;
                values.push(value);
                break;
            case 'like':
                condition = `${key} LIKE ?`;
                values.push(`%${value}%`);
                break;
            case 'notIn':
                condition = `${key} NOT IN (${placeholders})`;
                values.push(...value);
            case 'ne':
                condition = `${key} != ?`;
                values.push(value);
                break;
            case 'between':
                condition = `${key} BETWEEN ? AND ?`;
                values.push(...value);
                break;
            default:
                break;
        }

        if (condition) clauseParts.push(condition);
    });

    return {
        clause: `WHERE ${clauseParts.join(' AND ')}`,
        values,
    };
};

// UPDATE clause builder
export const buildUpdateClause = (updateModel = {}) => {
    const keys = Object.keys(updateModel);
    const clauseParts = [];
    const values = [];

    keys.forEach(key => {
        clauseParts.push(`${key} = ?`);
        values.push(updateModel[key]);
    });

    return {
        clause: clauseParts.join(', '),
        values,
    };
};

// JOIN clause builder
export const buildJoinClause = (joins = []) => {
    if (!Array.isArray(joins)) return '';
    return joins.map(join => {
        const { type = 'INNER', table, on } = join;
        return `${type.toUpperCase()} JOIN ${table} ON ${on}`;
    }).join(' ');
};

// ORDER BY / LIMIT
export const buildOrderAndLimit = ({ orderBy = '', limit, offset } = {}) => {
    let clause = '';
    if (orderBy) clause += ` ORDER BY ${orderBy}`;
    if (limit != null) clause += ` LIMIT ${limit}`;
    if (offset != null) clause += ` OFFSET ${offset}`;
    return clause;
};

