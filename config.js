const path = require('path');

const rootPath = __dirname;

module.exports = {
    rootPath,
    uploadPath: path.join(rootPath, 'public/uploads'),
    dbUrl: 'mongodb://localhost/class92',
    mongoOptions: {useNewUrlParser: true, useCreateIndex: true},
    port: 8000
};