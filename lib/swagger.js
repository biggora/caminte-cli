/**
 * Created by Alex on 8/23/2016.
 */
var inflection = require( './inflection' );
var fs = require( 'fs' );
var path = require( 'path' );

var schema = {
    define: function (model, fields, ind) {
        return {
            model: model,
            fields: fields,
            primaryKeys: ind.primaryKeys || [],
            indexes: ind.indexes || {}
        }
    }
};

schema.Text = function Text() {
};
schema.JSON = schema.Json = function JSON() {
};
schema.Float = function Float() {
};
schema.Real = schema.Double = function Real() {
};
schema.Int = schema.Integer = function Integer() {
};
schema.UUID = schema.Uuid = function UUID() {
};
schema.TimeUUID = schema.TimeUuid = function TimeUUID() {
};
schema.CounterColumn = function CounterColumn() {
};
schema.Blob = schema.Bytes = function Blob() {
};

schema.Date = schema.Timestamp = Date;
schema.Boolean = schema.Tinyint = Boolean;
schema.Number = Number;
schema.String = schema.Varchar = String;

var models = {};
var defaultSwagger = {
    'swagger': '2.0',
    'info': {
        'title': 'Service API',
        'description': 'Service API',
        'version': '1.0.0',
        'termsOfService': 'http://example.com/terms/',
        'contact': {
            'email': 'api@example.com'
        },
        'license': {
            'name': 'Apache 2.0',
            'url': 'http://www.apache.org/licenses/LICENSE-2.0.html'
        }
    },
    'host': 'api.example.com',
    'schemes': [
        'http'
    ],
    'basePath': '/v1',
    'produces': [
        'application/json',
        'application/xml'
    ],
    'paths': {},
    'definitions': {
        'Error': {
            'type': 'object',
            'properties': {
                'code': {
                    'type': 'integer',
                    'format': 'int32'
                },
                'message': {
                    'type': 'string'
                },
                'fields': {
                    'type': 'string'
                }
            }
        }
    }
};

module.exports.createSwagger = function (dstpath) {

    var modelDir = path.join( dstpath, 'models' );
    var modelList = fs.readdirSync( modelDir );

    for ( var m = 0; m < modelList.length; m++ ) {
        var modelFileName = modelList[ m ];
        if ( /\.js$/i.test( modelFileName ) ) {
            var modelName = modelFileName.replace( /\.js$/i, '' );
            var modelLower = modelName.toString().toLowerCase();
            var modelPlural = modelLower.pluralize();
            var model = modelDir + '/' + modelFileName;
            var apiPath = '/' + modelPlural;
            models[ modelName ] = require( model )( schema );

            defaultSwagger.definitions[ modelName ] = {
                'type': 'object',
                'properties': {}
            };
            defaultSwagger.paths[ apiPath ] = {
                'post': {
                    'summary': 'Create ' + modelName,
                    'description': 'Description for collection ' + modelName,
                    'produces': [
                        'application/json',
                        'application/xml'
                    ],
                    'parameters': [],
                    'tags': [
                        modelPlural
                    ],
                    'responses': {
                        '200': {
                            'description': 'An array of ' + modelLower.pluralize(),
                            'schema': {
                                'type': 'object',
                                'items': {
                                    '$ref': '#/definitions/' + modelName
                                }
                            }
                        },
                        '400': {
                            'description': 'Invalid ID supplied',
                            'schema': {
                                '$ref': '#/definitions/Error'
                            }
                        },
                        '404': {
                            'description': modelName + ' not found',
                            'schema': {
                                '$ref': '#/definitions/Error'
                            }
                        },
                        'default': {
                            'description': 'Unexpected error',
                            'schema': {
                                '$ref': '#/definitions/Error'
                            }
                        }
                    }
                },
                'get': {
                    'summary': modelName.pluralize() + ' List',
                    'description': 'Description for collection ' + modelName,
                    'produces': [
                        'application/json',
                        'application/xml'
                    ],
                    'parameters': [],
                    'tags': [
                        modelPlural
                    ],
                    'responses': {
                        '200': {
                            'description': 'An array of ' + modelLower.pluralize(),
                            'schema': {
                                'type': 'array',
                                'items': {
                                    '$ref': '#/definitions/' + modelName
                                }
                            }
                        },
                        '400': {
                            'description': 'Invalid ID supplied',
                            'schema': {
                                '$ref': '#/definitions/Error'
                            }
                        },
                        '404': {
                            'description': modelName + ' not found',
                            'schema': {
                                '$ref': '#/definitions/Error'
                            }
                        },
                        'default': {
                            'description': 'Unexpected error',
                            'schema': {
                                '$ref': '#/definitions/Error'
                            }
                        }
                    }
                }
            };
            defaultSwagger.paths[ apiPath + '/{id}' ] = {
                'get': {
                    'summary': 'Find ' + modelLower + ' by ID',
                    'description': 'Returns a single ' + modelLower,
                    'operationId': 'findById',
                    'produces': [
                        'application/json',
                        'application/xml'
                    ],
                    'parameters': [
                        {
                            'name': 'id',
                            'in': 'path',
                            'description': 'ID of ' + modelLower + ' to return',
                            'required': true,
                            'type': 'integer',
                            'format': 'int64'
                        }
                    ],
                    'tags': [
                        modelPlural
                    ],
                    'responses': {
                        '200': {
                            'description': 'Successful operation',
                            'schema': {
                                '$ref': '#/definitions/' + modelName
                            }
                        },
                        '400': {
                            'description': 'Invalid ID supplied',
                            'schema': {
                                '$ref': '#/definitions/Error'
                            }
                        },
                        '404': {
                            'description': modelName + ' not found',
                            'schema': {
                                '$ref': '#/definitions/Error'
                            }
                        },
                        'default': {
                            'description': 'Unexpected error',
                            'schema': {
                                '$ref': '#/definitions/Error'
                            }
                        }
                    }
                },
                'put': {
                    'summary': 'Update ' + modelLower + ' by ID',
                    'description': 'Returns a single ' + modelLower,
                    'operationId': 'updateById',
                    'produces': [
                        'application/json',
                        'application/xml'
                    ],
                    'parameters': [
                        {
                            'name': 'id',
                            'in': 'path',
                            'description': 'ID of ' + modelLower + ' to update',
                            'required': true,
                            'type': 'integer',
                            'format': 'int64'
                        }
                    ],
                    'tags': [
                        modelPlural
                    ],
                    'responses': {
                        '200': {
                            'description': 'Successful operation',
                            'schema': {
                                '$ref': '#/definitions/' + modelName
                            }
                        },
                        '400': {
                            'description': 'Invalid ID supplied',
                            'schema': {
                                '$ref': '#/definitions/Error'
                            }
                        },
                        '404': {
                            'description': modelName + ' not found',
                            'schema': {
                                '$ref': '#/definitions/Error'
                            }
                        },
                        'default': {
                            'description': 'Unexpected error',
                            'schema': {
                                '$ref': '#/definitions/Error'
                            }
                        }
                    }
                },
                'delete': {
                    'summary': 'Delete ' + modelLower + ' by ID',
                    'description': 'Returns a single ' + modelLower,
                    'operationId': 'deleteById',
                    'produces': [
                        'application/json',
                        'application/xml'
                    ],
                    'parameters': [
                        {
                            'name': 'id',
                            'in': 'path',
                            'description': 'ID of ' + modelLower + ' to delete',
                            'required': true,
                            'type': 'integer',
                            'format': 'int64'
                        }
                    ],
                    'tags': [
                        modelPlural
                    ],
                    'responses': {
                        '200': {
                            'description': 'Successful operation',
                            'schema': {
                                '$ref': '#/definitions/' + modelName
                            }
                        },
                        '400': {
                            'description': 'Invalid ID supplied',
                            'schema': {
                                '$ref': '#/definitions/Error'
                            }
                        },
                        '404': {
                            'description': modelName + ' not found',
                            'schema': {
                                '$ref': '#/definitions/Error'
                            }
                        },
                        'default': {
                            'description': 'Unexpected error',
                            'schema': {
                                '$ref': '#/definitions/Error'
                            }
                        }
                    }
                }
            };

            defaultSwagger.paths[ apiPath + '/new' ] = {
                'get': {
                    'summary': 'Create empty ' + modelLower,
                    'description': 'Returns a single ' + modelLower,
                    'operationId': 'new',
                    'produces': [
                        'application/json',
                        'application/xml'
                    ],
                    'parameters': [],
                    'tags': [
                        modelPlural
                    ],
                    'responses': {
                        '200': {
                            'description': 'Successful operation',
                            'schema': {
                                '$ref': '#/definitions/' + modelName
                            }
                        },
                        '400': {
                            'description': 'Invalid params to create',
                            'schema': {
                                '$ref': '#/definitions/Error'
                            }
                        },
                        'default': {
                            'description': 'Unexpected error',
                            'schema': {
                                '$ref': '#/definitions/Error'
                            }
                        }
                    }
                }
            };

            defaultSwagger.paths[ apiPath + '/count' ] = {
                'get': {
                    'summary': 'Get amount of ' + modelLower,
                    'description': 'Returns a count of ' + modelLower,
                    'operationId': 'count',
                    'produces': [
                        'application/json',
                        'application/xml'
                    ],
                    'parameters': [],
                    'tags': [
                        modelPlural
                    ],
                    'responses': {
                        '200': {
                            'description': 'Successful operation',
                            'schema': {
                                '$ref': '#/definitions/' + modelName
                            }
                        },
                        '400': {
                            'description': 'Invalid params to count',
                            'schema': {
                                '$ref': '#/definitions/Error'
                            }
                        },
                        'default': {
                            'description': 'Unexpected error',
                            'schema': {
                                '$ref': '#/definitions/Error'
                            }
                        }
                    }
                }
            };

            defaultSwagger.paths[ apiPath ].get.parameters.push( {
                'name': 'id',
                'type': 'integer',
                'format': 'int64',
                'in': 'query',
                'description': 'The unique identifier for a ' + modelName
            } );

            for ( var field in models[ modelName ].fields ) {
                var fullField = models[ modelName ].fields[ field ];
                var type = (fullField.type.name || 'string').toString().toLowerCase();
                var fullParam = {
                    'name': field,
                    'type': type,
                    'in': 'query',
                    'description': 'Description for field ' + field
                };
                defaultSwagger.definitions[ modelName ].properties[ field ] = {
                    'type': type,
                    'description': 'Description for field ' + field
                };


                switch ( type ) {
                    case 'number':
                        fullParam.type = 'integer';
                        fullParam.format = (fullField.limit && fullField.limit > 11) ? 'int64' : 'int32';
                        break;
                    case 'float':
                    case 'double':
                    case 'real':
                        fullParam.type = 'number';
                        fullParam.format = type === 'real' ? 'double' : type;
                        break;
                    case 'date':
                        fullParam.type = 'string';
                        fullParam.format = 'date';
                        break;
                    case 'json':
                        fullParam.type = 'string';
                        fullParam.format = 'object';
                        break;
                }

                if ( fullField.limit ) {
                    fullParam.required = true;
                }
                defaultSwagger.paths[ apiPath ].get.parameters.push( fullParam );

            }

        }
    }

    fs.writeFileSync( dstpath + '/swagger.json', JSON.stringify( defaultSwagger, null, 4 ), 'utf8' );

};
