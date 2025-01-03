const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    console.log('🛡️ Checking Authorization Header:', authHeader); // Debugging Line

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.warn('⚠️ Authorization Header Missing or Invalid');
        return res.status(401).json({ message: 'Unauthorized: Missing or Invalid Token' });
    }

    const token = authHeader.split(' ')[1];
    console.log('🔑 Extracted Token:', token); // Debugging Line

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('✅ Token Decoded:', decoded); // Debugging Line
        req.user = decoded;
        next();
    } catch (err) {
        console.error('❌ Token Verification Failed:', err.message);
        return res.status(401).json({ message: 'Unauthorized: Invalid Token' });
    }
};
