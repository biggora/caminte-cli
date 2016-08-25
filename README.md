[![Dependency Status](https://gemnasium.com/biggora/caminte-cli.png)](https://gemnasium.com/biggora/caminte-cli)
[![NPM version](https://badge.fury.io/js/caminte-cli.png)](http://badge.fury.io/js/caminte-cli)
## CaminteJS CLI

  Command line interface for [CaminteJS](https://github.com/biggora/caminte) Cross-db ORM

## Installation

    $ npm install -g caminte-cli
    
### Options

  Usage: caminte [options] [name] [fields]

  Options:

    -h, --help                        output usage information
    -V, --version                     output the version number
    -i, --init                        create structure and config
    -a, --adapter [name]              database adapter (mysql|redis|etc...)
    -m, --model <modelname> [fields]  create data model
    -r, --route <routename>           create data routes
    -c, --crud  <crudname>  [fields]  create model and route
    -d, --dump  <dumpfile>            parse sql dump file
    -t, --tests                       add tests
    -f, --force                       force on non-empty directory
    -w, --swagger                     generate swagger.json

### Usage with Express

[Usage with Express.JS here](https://github.com/biggora/caminte-cli/wiki/Usage-with-express.js)

## Quick Start

 The quickest way to get started with caminte is to utilize the executable `caminte(1)` to create an models and routes as shown below:

### Create structure:

    $ caminte -i -a mysql
    
### Create model:

    $ caminte -m User active:int name email password note:text created:date
    # with tests  
    $ caminte -t -m User active:int name email password note:text created:date
   
    
### Create model and routes:

    $ caminte -c Post published:bool title content:text created:date
    # with tests    
    $ caminte -t -c User active:int name email password note:text created:date
    
    
### Create model and routes from SQL dump:

    $ caminte -d dumpfile.sql
   
    
### Routes

will provide the following routes:

    method        route                    action 
    ------------------------------------------------------------
    GET           /:table                  index    
    GET           /:table/new              new     
    GET           /:table/:id              show       
    POST          /:table                  create    
    PUT           /:table/:id              update      
    DELETE        /:table/:id              destroy 
    DELETE        /:table/all              truncate


### Directory structure

On initialization directories tree generated, like that:

    .
    | 
    |-- models
    |   |-- User.js
    |   `-- ...
    |-- routes
    |   |-- users.js
    |   `-- ...
    |-- test
    |   |-- model
    |   |   |-- user.js
    |   |   `-- ...
    |   |-- route
    |   |   |-- user.js
    |   |   `-- ...
    |   |-- unit
    |   |   |-- user.js
    |   |   `-- ...
    |   `-- tests.js
    `-- database.js
    
    
### Create swagger.json file:

    $ caminte -w

### CaminteJS ORM db adapters:
    mysql, sqlite3, postgres, mongodb, redis, neo4j, riak, couchdb, rethinkdb, tingodb, arangodb

<table>
    <tr>
      <td><img width="100" src="https://github.com/biggora/caminte/raw/master/media/memory.png"/></td>
      <td><img width="100" src="https://github.com/biggora/caminte/raw/master/media/mongodb.png"/></td>
      <td><img width="100" src="https://github.com/biggora/caminte/raw/master/media/mysql.png"/></td>
      <td><img width="100" src="https://github.com/biggora/caminte/raw/master/media/postgresql.png"/></td>
      <td><img width="100" src="https://github.com/biggora/caminte/raw/master/media/sqlite.png"/></td>
      <td><img width="100" src="https://github.com/biggora/caminte/raw/master/media/mariadb.png"/></td>
      <td><img width="100" src="https://github.com/biggora/caminte/raw/master/media/firebird.png"/></td>   
    </tr>
    <tr>
      <td><img width="100" src="https://github.com/biggora/caminte/raw/master/media/couchdb.png"/></td>
      <td><img width="100" src="https://github.com/biggora/caminte/raw/master/media/rethinkdb.png"/></td>
      <td><img width="100" src="https://github.com/biggora/caminte/raw/master/media/redis.png"/></td> 
      <td><img width="100" src="https://github.com/biggora/caminte/raw/master/media/tingodb.png"/></td>      
      <td><img width="100" src="https://github.com/biggora/caminte/raw/master/media/neo4j.png"/></td> 
      <td><img width="100" src="https://github.com/biggora/caminte/raw/master/media/arangodb.png"/></td>
      <td><img width="100" src="https://github.com/biggora/caminte/raw/master/media/cassandra.png"/></td>
    </tr>
</table>


### Recommend extensions

- [TrinteJS](http://www.trintejs.com/) - Javascrpt MVC Framework for Node.JS
- [CaminteJS](http://www.camintejs.com/) - Cross-db ORM for NodeJS
- [2CO](https://github.com/biggora/2co) - is the module that will provide nodejs adapters for 2checkout API payment gateway.

## License

(The MIT License)
 
Copyright (c) 2014 Alexey Gordeyev &lt;aleksej@gordejev.lv&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Resources

- Visit the [author website](http://www.gordejev.lv).
- Follow [@biggora](https://twitter.com/#!/biggora) on Twitter for updates.
- Report issues on the [github issues](https://github.com/biggora/caminte-cli/issues) page.

[![Analytics](https://ga-beacon.appspot.com/UA-22788134-5/caminte-cli/readme)](https://github.com/igrigorik/ga-beacon) [![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/biggora/caminte-cli/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
