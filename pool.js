const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'pf',
    password: '9191',
    port: 5432
});

// checking the database connection
pool.on('error!', (err, client) => {
    console.error('Database Connection Failed, err');
    process.exit(-1);
})

module.exports = pool;
