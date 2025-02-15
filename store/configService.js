import { insertConfig, getAllConfig } from './database';

const initConfigService = async () => {
    let exist = await getAllConfig();

    if (exist && exist.length > 0) {
        return;
    }

    let serviceList = [
        {
            title: 'Email',
            mainHeader: [{ headerKey: 'emailId', headerValue: 'Email' }],
            showDataHeader: [
                { headerKey: 'companyType', headerValue: 'Company Type', position: 0, isVisible: 1 },
                { headerKey: 'accountHolderName', headerValue: 'Account User Name', position: 1, isVisible: 1 },
                { headerKey: 'emailId', headerValue: 'Email', position: 2, isVisible: 1 },
                { headerKey: 'password', headerValue: 'Password', position: 3, isVisible: 1 }
            ],
            isShare: 1,
            isVisible: 1
        },
        {
            title: 'Net Banking',
            mainHeader: [{ headerKey: 'accountNumber', headerValue: 'Account Number' }],
            showDataHeader: [
                { headerKey: 'accountType', headerValue: 'Account Type', position: 0, isVisible: 1 },
                { headerKey: 'bankName', headerValue: 'Bank Name', position: 1, isVisible: 1 },
                { headerKey: 'accountNumber', headerValue: 'Account Number', position: 2, isVisible: 1 },
                { headerKey: 'userId', headerValue: 'User Name', position: 3, isVisible: 1 },
                { headerKey: 'password', headerValue: 'Password', position: 4, isVisible: 1 }
            ],
            isShare: 1,
            isVisible: 1
        },
        {
            title: 'App Details',
            mainHeader: [{ headerKey: 'appName', headerValue: 'App Name' }],
            showDataHeader: [
                { headerKey: 'appName', headerValue: 'App Name', position: 0, isVisible: 1 },
                { headerKey: 'username', headerValue: 'User Name', position: 1, isVisible: 1 },
                { headerKey: 'password', headerValue: 'Password', position: 2, isVisible: 1 },
                { headerKey: 'securityQA', headerValue: 'Security Q&A', position: 3, isVisible: 1 }
            ],
            isShare: 1,
            isVisible: 1
        },
        {
            title: 'Bank Account',
            mainHeader: [{ headerKey: 'accountNumber', headerValue: 'Account Number' }],
            showDataHeader: [
                { headerKey: 'accountNumber', headerValue: 'Account Number', position: 0, isVisible: 1 },
                { headerKey: 'accountHolderName', headerValue: 'Account Holder Name', position: 1, isVisible: 1 },
                { headerKey: 'bankName', headerValue: 'Bank Name', position: 2, isVisible: 1 },
                { headerKey: 'branch', headerValue: 'Branch', position: 3, isVisible: 1 },
                { headerKey: 'city', headerValue: 'City', position: 4, isVisible: 1 },
                { headerKey: 'ifscCode', headerValue: 'IFSC Code', position: 5, isVisible: 1 },
                { headerKey: 'cifCode', headerValue: 'CIF Code', position: 6, isVisible: 1 }
            ],
            isShare: 1,
            isVisible: 1
        },
        {
            title: 'Card Details',
            mainHeader: [{ headerKey: 'cardNumber', headerValue: 'Card Number' }],
            showDataHeader: [
                { headerKey: 'bankName', headerValue: 'Bank Name', position: 0, isVisible: 1 },
                { headerKey: 'cardNumber', headerValue: 'Card Number', position: 1, isVisible: 1 },
                { headerKey: 'cvv', headerValue: 'CVV', position: 2, isVisible: 1 },
                { headerKey: 'validDate', headerValue: 'Valid Date', position: 3, isVisible: 1 },
                { headerKey: 'cardHolderName', headerValue: 'Card Holder Name', position: 4, isVisible: 1 },
                { headerKey: 'pin', headerValue: 'PIN', position: 5, isVisible: 1 },
                { headerKey: 'cardType', headerValue: 'Card Type', position: 6, isVisible: 1 }
            ],
            isShare: 1,
            isVisible: 1
        },
        {
            title: 'Demat',
            mainHeader: [{ headerKey: 'dematId', headerValue: 'Demat ID' }],
            showDataHeader: [
                { headerKey: 'dematId', headerValue: 'Demat ID', position: 0, isVisible: 1 },
                { headerKey: 'username', headerValue: 'User Name', position: 1, isVisible: 1 },
                { headerKey: 'password', headerValue: 'Password', position: 2, isVisible: 1 },
                { headerKey: 'note', headerValue: 'Note', position: 3, isVisible: 1 }
            ],
            isShare: 1,
            isVisible: 1
        },
        {
            title: 'NotePad',
            mainHeader: [{ headerKey: 'title', headerValue: 'Title' }],
            showDataHeader: [
                { headerKey: 'title', headerValue: 'Title', position: 0, isVisible: 1 },
                { headerKey: 'note', headerValue: 'Note', position: 1, isVisible: 1 }
            ],
            isShare: 1,
            isVisible: 1
        },
        {
            title: 'Other',
            mainHeader: [{ headerKey: 'type', headerValue: 'Type' }],
            showDataHeader: [
                { headerKey: 'type', headerValue: 'Type', position: 0, isVisible: 1 },
                { headerKey: 'details', headerValue: 'Details', position: 1, isVisible: 1 }
            ],
            isShare: 1,
            isVisible: 1
        }
    ];

    // Using for...of to correctly await each database insertion
    for (const service of serviceList) {
        await insertConfig(
            service.title,
            JSON.stringify(service.mainHeader),
            JSON.stringify(service.showDataHeader), // Corrected JSON.stringify
            service.isShare,
            service.isVisible
        );
    }
};

export { initConfigService };
