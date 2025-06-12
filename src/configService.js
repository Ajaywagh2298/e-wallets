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
        },
        {
            title: 'Task',
            table_key: 'task',
            mainHeader: [
                { headerKey: 'Task Name', headerValue: 'taskName' },
                { headerKey: 'Priority', headerValue: 'priority' }
            ],
            showDataHeader: [
                { headerKey: 'taskName', headerValue: 'Task Name', position: 0, isVisible: 1},
                { headerKey: 'priority', headerValue: 'Priority' ,position: 1, isVisible: 1},
                { headerKey: 'dueDate', headerValue: 'Due Date', position: 2, isVisible: 1 },
                { headerKey: 'category', headerValue: 'Category', position: 3, isVisible: 1 },
                { headerKey: 'status', headerValue: 'Status', position: 4, isVisible: 1 },
                { headerKey: 'description', headerValue: 'Description', position: 5, isVisible: 1 },
                { headerKey: 'reminder', headerValue: 'Reminder', position: 6, isVisible: 1 },
                { headerKey: 'reminderType', headerValue: 'Reminder Type', position: 7, isVisible: 1 },
                { headerKey: 'reminderValue', headerValue: 'Set By', position: 8, isVisible: 1 },
            ],
            isShare: 0,
            isVisible: 1
        },{
            title: 'Emergency Contact',
            table_key: 'emergency_contact',
            mainHeader: [
                { headerKey: 'Name', headerValue: 'name' },
                { headerKey: 'Phone', headerValue: 'phone' }
            ],
            showDataHeader: [
                { headerKey: 'name', headerValue: 'Name', position: 0, isVisible: 1 },
                { headerKey: 'phone', headerValue: 'Phone', position: 1, isVisible: 1 },
                { headerKey: 'relation', headerValue: 'Relation', position: 2, isVisible: 1 },
                { headerKey: 'bloodGroup', headerValue: 'Blood Group', position: 3, isVisible: 1 },
                { headerKey: 'allergies', headerValue: 'Allergies', position: 4, isVisible: 1 },
                { headerKey: 'medicalConditions', headerValue: 'Medical Conditions', position: 5, isVisible: 1 },
                { headerKey: 'currentMedication', headerValue: 'Current Medication', position: 6, isVisible: 1 },
                { headerKey: 'insuranceDetails', headerValue: 'Insurance Details', position: 6, isVisible: 1 },
                { headerKey: 'policyNumber', headerValue: 'Policy Number', position: 6, isVisible: 1 },
                { headerKey: 'emergencyPlan', headerValue: 'Emergency Plan', position: 6, isVisible: 1 },
                { headerKey: 'notes', headerValue: 'Addition Info.', position: 6, isVisible: 1 },
            ],
            isShare: 0,
            isVisible: 1
        },
        {
            title: 'Fecure File Locker',
            table_key: 'secure_file_locker',
            mainHeader: [
                { headerKey: 'File Name', headerValue: 'fileName' },
                { headerKey: 'File Type', headerValue: 'file_type' }
            ],
            showDataHeader: [
                { headerKey: 'fileNamee', headerValue: 'File Name', position: 0, isVisible: 1 },
                { headerKey: 'file_type', headerValue: 'file_type', position: 1, isVisible: 1 },
                { headerKey: 'file_path', headerValue: 'File Path', position: 2, isVisible: 1 },
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
             // console.log(`✅ Service inserted: ${service.title}`);
        } catch (error) {
            await saveLogs(`Config Error - ${error}`);
             // console.error(`❌ Failed to insert service: ${service.title}`, error);
        }
    }
};


export const initCustomForms = async () => {
    let exist = await selectQuery('custom_form', {}, '*', { orderBy: 'title' });
    if (exist && exist.length > 0) return;

    let formFields = [
        {
          "title": "PAN Details",
          "form_inputs": [{
            "key" : "holderName",
            "label": "PAN Holder Name",
            "inputType" : "TEXT"
          },{
            "key" : "panNumber",
            "label": "PAN Number",
            "inputType" : "TEXT"
          }],
          "active": 1,
          "isReminder": 0
        },{
          "title": "Aadhar Details",
          "form_inputs": [{
            "key" : "holderName",
            "label": "Aadhar Holder Name",
            "inputType" : "TEXT"
          },{
            "key" : "aadharNumber",
            "label": "Aadhar Number",
            "inputType" : "NUMBER"
          }],
          "active": 1,
          "isReminder": 0
        } ,{
          "title": "NPS",
          "form_inputs": [{
            "key" : "pranNumber",
            "label": "PRAN Number",
            "inputType" : "TEXT"
          },{
            "key" : "userName",
            "label": "User Name",
            "inputType" : "TEXT"
          },{
            "key" : "password",
            "label": "Password",
            "inputType" : "TEXT"
          }],
          "active": 1,
          "isReminder": 0
        },{
          "title": "EPFO",
          "form_inputs": [{
            "key" : "uan",
            "label": "UAN Number",
            "inputType" : "TEXT"
          },{
            "key" : "userName",
            "label": "User Name",
            "inputType" : "TEXT"
          },{
            "key" : "password",
            "label": "Password",
            "inputType" : "TEXT"
          }],
          "active": 1,
          "isReminder": 0
        },{
          "title": "Driving License",
          "form_inputs": [{
            "key" : "licenseNumber",
            "label": "License Number",
            "inputType" : "TEXT"
          },{
            "key" : "validMonth",
            "label": "Valid Until (Month)",
            "inputType" : "NUMBER"
          },{
            "key" : "validYear",
            "label": "Valid Until (Year)",
            "inputType" : "NUMBER"
          }],
          "active": 1,
          "isReminder": 0
        }
        ,{
          "title": "Voting ID",
          "form_inputs": [{
            "key" : "voterID",
            "label": "Voter ID Number",
            "inputType" : "TEXT"
          },{
            "key" : "holderName",
            "label": "Voter Holder Name",
            "inputType" : "TEXT"
          }],
          "active": 1,
          "isReminder": 0
        },{
          "title": "Passport",
          "form_inputs": [{
            "key" : "passportNumber",
            "label": "Passport Number",
            "inputType" : "TEXT"
          },{
            "key" : "expiryMonth",
            "label": "Expiry Month",
            "inputType" : "NUMBER"
          },{
            "key" : "expiryYear",
            "label": "Expiry Year",
            "inputType" : "NUMBER"
          }],
          "active": 1,
          "isReminder": 0
        }, {
          "title": "Property Details",
          "form_inputs": [
            {
              "key": "propertyType",
              "label": "Property Type (e.g. Flat, Plot, House)",
              "inputType": "TEXT"
            },
            {
              "key": "ownerName",
              "label": "Owner Name",
              "inputType": "TEXT"
            },
            {
              "key": "address",
              "label": "Property Address",
              "inputType": "TEXT"
            },
            {
              "key": "rentAmount",
              "label": "Rent Amount",
              "inputType": "NUMBER"
            },
            {
              "key": "deposit",
              "label": "Deposit Amount",
              "inputType": "NUMBER"
            },
            {
              "key": "agrementType",
              "label": "Agrement Type",
              "inputType": "TEXT"
            },
            {
              "key": "fromDate",
              "label": "Start Date",
              "inputType": "DATE"
            }
          ],
          "active": 1,
          "isReminder": 0
        },
        {
          "title": "Electricity Bill Details",
          "form_inputs": [
            {
              "key": "connectionNumber",
              "label": "Connection Number",
              "inputType": "TEXT"
            },
            {
              "key": "consumerNumber",
              "label": "Consumer Number",
              "inputType": "NUMBER"
            }, {
              "key": "consumerName",
              "label": "Consumer Name",
              "inputType": "TEXT"
            }
          ],
          "active": 1,
          "isReminder": 0
        },
        {
          "title": "Water Bill Details",
          "form_inputs": [
            {
              "key": "connectionNumber",
              "label": "Connection Number",
              "inputType": "TEXT"
            }, {
              "key": "consumerName",
              "label": "Consumer Name",
              "inputType": "TEXT"
            }
          ],
          "active": 1,
          "isReminder": 0
        },
        {
          "title": "Gas Connection Details",
          "form_inputs": [
            {
              "key": "connectionNumber",
              "label": "Connection Number",
              "inputType": "TEXT"
            },
            {
              "key": "agencyName",
              "label": "Agency Name",
              "inputType": "TEXT"
            },
            {
              "key": "consumerNumber",
              "label": "Consumer Number",
              "inputType": "TEXT"
            }
          ],
          "active": 1,
          "isReminder": 0
        }
      ]

      for (const service of formFields) {
        try {
            await insertQuery('custom_form', {
                title: service.title,
                form_inputs : JSON.stringify(service.form_inputs),
                active : service.active,
                isReminder : service.isReminder
            });
             // console.log(`✅ Custom Forms inserted: ${service.title}`);
        } catch (error) {
            await saveLogs(`Custom Forms Error - ${error}`);
             // console.error(`❌ Failed to insert Custom Forms: ${service.title}`, error);
        }
    }
}