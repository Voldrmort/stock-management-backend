const bcrypt = require('bcryptjs');
const { cloudant, dbName } = require('../services/cloudantServices');

// 📝 **Register User**
const registerUser = async (req, res) => {
    const { username, password, role } = req.body;

    try {
        if (!dbName) {
            console.error('❌ Database name is not defined');
            return res.status(500).json({ message: 'Server error: Database not defined' });
        }

        // Query for existing user
        const query = {
            selector: { username: username }
        };

        const result = await cloudant.postFind({
            db: dbName,
            selector: query.selector
        });

        if (result.docs && result.docs.length > 0) {
            console.log('❌ User already exists');
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('🔑 Hashed Password:', hashedPassword);

        // Insert new user
        const newUser = {
            username,
            password: hashedPassword,
            role: role || 'user'
        };

        await cloudant.postDocument({
            db: dbName,
            document: newUser
        });

        console.log('✅ User registered successfully:', username);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('🔥 Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// 📝 **Login User**
const jwt = require('jsonwebtoken');
const loginUser = async (req, res) => {
    const { username, password } = req.body;
    console.log('🔍 Debug: Incoming login credentials:', req.body.username, req.body.password);

    try {
        console.log('🔍 Attempting to log in user:', username);

        // Fetch user from Cloudant
        const result = await cloudant.postFind({
            db: dbName,
            selector: { username: username }
        });

        console.log('🔍 Query Result:', result.result.docs);

        if (!result.result.docs || result.result.docs.length === 0) {
            console.log('❌ User not found');
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = result.result.docs[0];

        console.log('🔑 Stored Password Hash:', user.password);
        console.log('🔑 Provided Password:', password);

      // Compare password
              const isPasswordValid = await bcrypt.compare(password, user.password);
              console.log('🔑 Password Comparison Result:', isPasswordValid);

              if (!isPasswordValid) {
                  return res.status(401).json({ message: 'Invalid username or password' });
              }

              // Generate Token
              const token = jwt.sign(
                  { id: user._id, username: user.username, role: user.role },
                  process.env.JWT_SECRET || 'default_secret_key',
                  { expiresIn: '1h' }
              );

              console.log('✅ Token Generated:', token); // Debug Token

              // Send Response
              res.status(200).json({
                  token,
                  message: 'Login successful'
              });
          } catch (error) {
              console.error('❌ Login Error:', error);
              res.status(500).json({ message: 'Login failed', error: error.message });
          }

};
// 📝 **Export Functions**
module.exports = { registerUser, loginUser };
