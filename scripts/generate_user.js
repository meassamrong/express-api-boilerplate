const db_conn = require('../src/databases/mongodb_connection');
const userModel = require('../src/models/user_model');
const { getRolesByName } = require('../src/common/roles');
const { ifEmailExist } = require('../src/common/user');
const bcrypt = require('bcryptjs');

(async () => {
    await db_conn().catch((err) => {
        console.error('Generate User DB connection ERROR!', err);
        process.exit(1);
    });

    const userList = [
        {
            first_name: 'test',
            last_name: 'test',
            email: 'test@gmail.com',
            password: await bcrypt.hash('admin!68$$', 10),
            roles: ['user'],
            status: 'active',
        },
    ];

    for (let user of userList) {
        const existEmail = await ifEmailExist(user.email);
        if (existEmail) {
            console.log(`Email Already Use!`);
            process.exit(0);
        }
        user.roles = await Promise.all(user.roles.map((name) => getRolesByName(name)));

        const newUser = new userModel(user);
        const saveUser = await newUser.save();
        console.log(`New user: ${saveUser.first_name} ${saveUser.last_name}`);
    }

    process.exit(0);
})();
