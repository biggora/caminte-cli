/**
 *  Default database configuration file
 *
 *  Created by trinte-creator script
 *  App based on TrinteJS MVC framework
 *  TrinteJS homepage http://www.trintejs.com
 *
 *  docs: https://github.com/biggora/caminte/wiki/Connecting-to-DB#connecting
 **/

module.exports.production = {
    driver     : 'sqlite3',
    database   : './db/production.db'
};

module.exports.development = {
    driver     : 'sqlite3',
    database   : './db/development.db'
};

module.exports.test = {
    driver     : 'sqlite3',
    database   : './db/test.db'
};

module.exports.dev = module.exports.development;