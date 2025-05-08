import { database } from './database.js';
import { selectQuery , saveLogs, insertQuery } from './controller';

export const initConfigService = async () => {
    let exist = await selectQuery('config', {}, '*', { orderBy: 'title' });
    if (exist && exist.length > 0) return;

    const serviceList = [
        {
            title: 'Email',
            table_key: 'email_details',
            mainHeader: [
                { headerKey: 'Account Holder Name', headerValue: 'accountHolderName' },
                { headerKey: 'Email', headerValue: 'email' }
            ],
            showDataHeader: [
                { headerKey: 'companyType', headerValue: 'Company Type', position: 0, isVisible: 1 },
                { headerKey: 'accountHolderName', headerValue: 'Account Holder Name', position: 1, isVisible: 1 },
                { headerKey: 'email', headerValue: 'Email', position: 2, isVisible: 1 },
                { headerKey: 'password', headerValue: 'Password', position: 3, isVisible: 1 }
            ],
            isShare: 1,
            isVisible: 1
        },
        {
            title: 'Net Banking',
            table_key: 'net_banking',
            mainHeader: [
                { headerKey: 'Bank Name', headerValue: 'bankName' },
                { headerKey: 'Customer Id', headerValue: 'customerId' }
            ],
            showDataHeader: [
                { headerKey: 'bankName', headerValue: 'Bank Name', position: 0, isVisible: 1 },
                { headerKey: 'accountType', headerValue: 'Account Type', position: 1, isVisible: 1 },
                { headerKey: 'userName', headerValue: 'User Name', position: 2, isVisible: 1 },
                { headerKey: 'password', headerValue: 'Password', position: 3, isVisible: 1 },
                { headerKey: 'transactionPin', headerValue: 'Transaction PIN', position: 4, isVisible: 1 },
                { headerKey: 'customerId', headerValue: 'Customer ID', position: 5, isVisible: 1 }
            ],
            isShare: 1,
            isVisible: 1
        },
        {
            title: 'App Details',
            table_key: 'app_accounts',
            mainHeader: [
                { headerKey: 'App Name', headerValue: 'appName' },
                { headerKey: 'User Name', headerValue: 'username' }
            ],
            showDataHeader: [
                { headerKey: 'appName', headerValue: 'App Name', position: 0, isVisible: 1 },
                { headerKey: 'username', headerValue: 'User Name', position: 1, isVisible: 1 },
                { headerKey: 'password', headerValue: 'Password', position: 2, isVisible: 1 },
                { headerKey: 'securityQuestion', headerValue: 'Security Q&A', position: 3, isVisible: 1 }
            ],
            isShare: 1,
            isVisible: 1
        },
        {
            title: 'Bank Account',
            table_key: 'bank_account',
            mainHeader: [
                { headerKey: 'Bank Name', headerValue: 'bankName' },
                { headerKey: 'Account Number', headerValue: 'accountNumber' }
            ],
            showDataHeader: [
                { headerKey: 'accountNumber', headerValue: 'Account Number', position: 0, isVisible: 1 },
                { headerKey: 'accountHolderName', headerValue: 'Account Holder Name', position: 1, isVisible: 1 },
                { headerKey: 'accountType', headerValue: 'Account Type', position: 2, isVisible: 1 },
                { headerKey: 'bankName', headerValue: 'Bank Name', position: 3, isVisible: 1 },
                { headerKey: 'branch', headerValue: 'Branch', position: 4, isVisible: 1 },
                { headerKey: 'city', headerValue: 'City', position: 5, isVisible: 1 },
                { headerKey: 'ifscCode', headerValue: 'IFSC Code', position: 6, isVisible: 1 },
                { headerKey: 'cifCode', headerValue: 'CIF Code', position: 7, isVisible: 1 },
                { headerKey: 'micrCode', headerValue: 'MICR Code', position: 8, isVisible: 1 },
                { headerKey: 'mobileNumber', headerValue: 'Mobile Number', position: 9, isVisible: 1 },
                { headerKey: 'nomineeName', headerValue: 'Nominee Name', position: 10, isVisible: 1 },
                { headerKey: 'upiId', headerValue: 'UPI ID', position: 11, isVisible: 1 }
            ],
            isShare: 1,
            isVisible: 1
        },
        {
            title: 'Card Details',
            table_key: 'card_details',
            mainHeader: [
                { headerKey: 'Bank Name', headerValue: 'bankName' },
                { headerKey: 'Card Number', headerValue: 'cardNumber' }
            ],
            showDataHeader: [
                { headerKey: 'bankName', headerValue: 'Bank Name', position: 0, isVisible: 1 },
                { headerKey: 'cardNumber', headerValue: 'Card Number', position: 1, isVisible: 1 },
                { headerKey: 'cvv', headerValue: 'CVV', position: 2, isVisible: 1 },
                { headerKey: 'validDate', headerValue: 'Valid Date', position: 3, isVisible: 1 },
                { headerKey: 'cardHolderName', headerValue: 'Card Holder Name', position: 4, isVisible: 1 },
                { headerKey: 'cardType', headerValue: 'Card Type', position: 5, isVisible: 1 },
                { headerKey: 'cardLimit', headerValue: 'Card Limit', position: 6, isVisible: 1 }
            ],
            isShare: 1,
            isVisible: 1
        },
        {
            title: 'Demat',
            table_key: 'demat',
            mainHeader: [
                { headerKey: 'Broker Name', headerValue: 'brokerName' },
                { headerKey: 'Demat Account Number', headerValue: 'dematAccountNumber' }
            ],
            showDataHeader: [
                { headerKey: 'brokerName', headerValue: 'Broker Name', position: 0, isVisible: 1 },
                { headerKey: 'dematAccountNumber', headerValue: 'Demat Account No.', position: 1, isVisible: 1 },
                { headerKey: 'despositoryName', headerValue: 'Depository', position: 2, isVisible: 1 },
                { headerKey: 'tradingAccountNumber', headerValue: 'Trading Account No.', position: 3, isVisible: 1 },
                { headerKey: 'clientId', headerValue: 'Client ID', position: 4, isVisible: 1 },
                { headerKey: 'email', headerValue: 'Email', position: 5, isVisible: 1 },
                { headerKey: 'mobileNumber', headerValue: 'Mobile Number', position: 6, isVisible: 1 }
            ],
            isShare: 1,
            isVisible: 1
        },
        {
            title: 'Secure Notes',
            table_key: 'secure_notes',
            mainHeader: [
                { headerKey: 'Category', headerValue: 'category' },
                { headerKey: 'Content', headerValue: 'content' }
            ],
            showDataHeader: [
                { headerKey: 'category', headerValue: 'Category', position: 0, isVisible: 1 },
                { headerKey: 'content', headerValue: 'Content', position: 1, isVisible: 1 },
                { headerKey: 'locked', headerValue: 'Locked', position: 2, isVisible: 1 }
            ],
            isShare: 0,
            isVisible: 1
        },
        {
            title: 'Expense Details',
            table_key: 'expense_details',
            mainHeader: [
                { headerKey: 'Category', headerValue: 'category' },
                { headerKey: 'Date', headerValue: 'date' }
            ],
            showDataHeader: [
                { headerKey: 'date', headerValue: 'Date', position: 0, isVisible: 1 },
                { headerKey: 'category', headerValue: 'Category', position: 1, isVisible: 1 },
                { headerKey: 'amount', headerValue: 'Amount', position: 2, isVisible: 1 },
                { headerKey: 'paymentMethod', headerValue: 'Payment Method', position: 3, isVisible: 1 },
                { headerKey: 'monthlyLimit', headerValue: 'Monthly Limit', position: 4, isVisible: 1 }
            ],
            isShare: 0,
            isVisible: 1
        }
    ];

    for (const service of serviceList) {
        try {
            await insertQuery('config', {
                title: service.title,
                table_key: service.table_key,
                mainHeader: JSON.stringify(service.mainHeader),
                showDataHeader: JSON.stringify(service.showDataHeader),
                isShare: service.isShare,
                isVisible: service.isVisible
            });
            console.log(`✅ Service inserted: ${service.title}`);
        } catch (error) {
            await saveLogs(`Config Error - ${error}`);
            console.error(`❌ Failed to insert service: ${service.title}`, error);
        }
    }
};
