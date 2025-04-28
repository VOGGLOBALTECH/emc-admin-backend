    const mongoose = require('mongoose');
    const bcrypt = require('bcryptjs');
    const dotenv = require('dotenv');
    const User = require('./models/User');

    dotenv.config();

    async function createAdmin() {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      const password = 'admin123'; // You can change this password
        const admin = new User({
    name: 'Admin User',
    email: 'admin@example.com',
    password: password, // <-- use plain password, let the model hash it
    role: 'admin',
    status: 'active',
  });

      await admin.save();
      console.log('Admin user created!');
      mongoose.disconnect();
    }

    createAdmin().catch(err => {
      console.error(err);
      mongoose.disconnect();
    });