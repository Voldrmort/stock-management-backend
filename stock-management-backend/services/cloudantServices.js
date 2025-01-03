const { CloudantV1 } = require('@ibm-cloud/cloudant');
const { IamAuthenticator } = require('ibm-cloud-sdk-core');
require('dotenv').config();

// 🛡️ Initialize Cloudant Client
const cloudant = CloudantV1.newInstance({
    authenticator: new IamAuthenticator({
        apikey: process.env.CLOUDANT_API_KEY,
    }),
    serviceUrl: process.env.CLOUDANT_URL,
});

// 📚 Define Database Name
const dbName = process.env.CLOUDANT_DB;

// 🛡️ Validate Cloudant and Database
(async () => {
    try {
        const dbListResponse = await cloudant.getAllDbs();
        const databases = dbListResponse.result; // ✅ Correctly access the database list

        console.log('✅ Connected to Cloudant. Databases:', databases);

        if (!databases.includes(dbName)) {
            console.error(`❌ Database "${dbName}" does not exist.`);
            process.exit(1);
        } else {
            console.log(`✅ Database "${dbName}" exists.`);
        }
    } catch (error) {
        console.error('🔥 Cloudant Connection Error:', error);
        process.exit(1);
    }
})();

// Exporting client and database name
module.exports = { cloudant, dbName };
