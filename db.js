const Pool = require('pg').Pool// из пакета pg
const pool = new Pool({
    user: "postgres",
    password: 'nuetka',
    host: "localhost", 
    port: 5432,
    database: "films"
})

module.exports = pool // чтобф использ в др файлах