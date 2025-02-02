const helmet = require('helmet');
const app = require('./app'); // Your Express app import
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// ✅ Add Helmet and CSP Configuration
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                connectSrc: ["'self'", "http://localhost:5000","https://stock-management-backend-lvuu.onrender.com"],
                imgSrc: ["'self'", "data:"],
                styleSrc: ["'self'", "'unsafe-inline'"],
            },
        },
    })
);

// ✅ Server Start
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
