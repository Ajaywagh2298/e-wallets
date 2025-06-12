import { insertQuery ,selectQuery } from './controller';

let data = [
    { "name": "State Bank of India", "code": "SBIN" },
    { "name": "Punjab National Bank", "code": "PUNB" },
    { "name": "Bank of Baroda", "code": "BARB" },
    { "name": "Canara Bank", "code": "CNRB" },
    { "name": "Union Bank of India", "code": "UBIN" },
    { "name": "Bank of India", "code": "BKID" },
    { "name": "Indian Bank", "code": "IDIB" },
    { "name": "Indian Overseas Bank", "code": "IOBA" },
    { "name": "Central Bank of India", "code": "CBIN" },
    { "name": "UCO Bank", "code": "UCBA" },
    { "name": "Bank of Maharashtra", "code": "MAHB" },
    { "name": "Punjab and Sind Bank", "code": "PSIB" },
    { "name": "IDBI Bank", "code": "IBKL" },
    { "name": "HDFC Bank", "code": "HDFC" },
    { "name": "ICICI Bank", "code": "ICIC" },
    { "name": "Axis Bank", "code": "UTIB" },
    { "name": "Kotak Mahindra Bank", "code": "KKBK" },
    { "name": "Yes Bank", "code": "YESB" },
    { "name": "IndusInd Bank", "code": "INDB" },
    { "name": "RBL Bank", "code": "RATN" },
    { "name": "Federal Bank", "code": "FDRL" },
    { "name": "South Indian Bank", "code": "SIBL" },
    { "name": "Karur Vysya Bank", "code": "KVBL" },
    { "name": "City Union Bank", "code": "CIUB" },
    { "name": "Tamilnad Mercantile Bank", "code": "TMBL" },
    { "name": "Dhanlaxmi Bank", "code": "DLXB" },
    { "name": "CSB Bank", "code": "CSBK" },
    { "name": "IDFC FIRST Bank", "code": "IDFB" },
    { "name": "AU Small Finance Bank", "code": "AUBL" },
    { "name": "Equitas Small Finance Bank", "code": "ESFB" },
    { "name": "Ujjivan Small Finance Bank", "code": "UJVN" },
    { "name": "Fincare Small Finance Bank", "code": "FINC" },
    { "name": "Suryoday Small Finance Bank", "code": "SURY" },
    { "name": "Utkarsh Small Finance Bank", "code": "UTKS" },
    { "name": "Jana Small Finance Bank", "code": "JSFB" },
    { "name": "North East Small Finance Bank", "code": "NESF" },
    { "name": "ESAF Small Finance Bank", "code": "ESMF" },
    { "name": "Shivalik Small Finance Bank", "code": "SMCB" },
    { "name": "Unity Small Finance Bank", "code": "UNTY" },
    { "name": "Capital Small Finance Bank", "code": "CLBL" },
    { "name": "Airtel Payments Bank", "code": "AIRP" },
    { "name": "India Post Payments Bank", "code": "IPPB" },
    { "name": "Fino Payments Bank", "code": "FINO" },
    { "name": "Jio Payments Bank", "code": "JIOP" },
    { "name": "Standard Chartered Bank", "code": "SCBL" },
    { "name": "HSBC Bank", "code": "HSBC" },
    { "name": "Citi Bank", "code": "CITI" },
    { "name": "DBS Bank", "code": "DBSS" },
    { "name": "Deutsche Bank", "code": "DEUT" },
    { "name": "Barclays Bank", "code": "BARC" }
]

export const BankList = async () => {
    try {
        let existData = await selectQuery('banks', {}, '*');
        if (existData.length > 0) {
             // console.log('Bank data already exists in the database.');
            return;
        }
        for (let i = 0; i < data.length; i++) {
            let bank = {
                bank_name: data[i].name,
                bank_code: data[i].code
            };
            const result = await insertQuery('banks', bank);
        }
    } catch (error) {
         // console.error('Error inserting banks:', error);
    }
}