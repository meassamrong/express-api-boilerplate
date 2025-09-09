const rolesModel = require('../src/models/roles_model');
const mongodb = require('../src/databases/mongodb_connection');

(async () => {
    await mongodb().catch((err) => {
        console.log(`[MONGODB-ERROR] >>> ${err.message}`);
    });

    const rolesDefined = [
        {
            name: 'admin',
            permissions: ['manage:own_profile', 'manage:users', 'manage:role', 'manage:any_post'],
        },
        {
            name: 'editor',
            permissions: ['manage:own_profile', 'manage:any_post'],
        },
        {
            name: 'user',
            permissions: ['manage:own_profile', 'read:own_course'],
        },
    ];

    for (let i = 0; i < rolesDefined.length; i++) {
        const newRoles = new rolesModel({
            name: rolesDefined[i].name,
            permission: rolesDefined[i].permissions,
        });

        const saveNewRoles = await newRoles.save();
        console.log(`New Roles Created: ${saveNewRoles.name}`);
    }
    process.exit(0);
})();
