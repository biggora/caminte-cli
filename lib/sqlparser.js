/**
 * Created by Alex on 12/15/2015.
 */
module.exports = {
    checkdb : function (data) {
        'use strict';
        var type = 0;
        switch (true) {
            case /PostgreSQL/gim.test(data):
            case /pgSQL/gim.test(data):
                type = 3;
                break;
            case /phpMyAdmin/gim.test(data):
            case /MySQL/gim.test(data):
                type = 1;
                break;
            case /PRIMARY\sKEY\sAUTOINCREMENT/gim.test(data):
                type = 2;
                break;
            default:
                type = 0;
        }
        return type;
    },
    parse: function (sql, type) {
        'use strict';
        var self = this, tables = [], result;
        type = parseInt(type);
        var regex = /^(CREATE\sTABLE\sIF\sNOT\sEXISTS|CREATE\sTABLE\s)([\s`a-zA-Z0-9\.\(\),_'"\-:=]+)$/gim;
        if (type === 3) {
            regex = /^(CREATE\sTABLE\sIF\sNOT\sEXISTS|CREATE\sTABLE\s)([\sa-zA-Z0-9,\(\)\:'"_]+$)/gim;
        }

        while ((result = regex.exec(sql)) !== null) {
            var tsql = result[0], cindexes = [], uindexes = [];
            var tname = self.findTableName(tsql);
            if (tname) {
                var primary, table = {
                    modelName: tname.camelize().replace(/_/g, ''),
                    tableName: tname,
                    version: '0.0.1',
                    created: new Date().toISOString(),
                    fields: [],
                    indexes: [],
                    pkeys: []
                };
                if (type === 3) {
                    primary = self.findPrimary(table.table_name, sql);
                }
                var ssqls = self.splitToStrings(tsql);
                ssqls.shift();

                if (type === 3 || type === 2) {
                    cindexes = self.findIndexes(table.table_name, sql, type);
                    uindexes = self.findUniqueIndexes(table.table_name, sql);
                }

                var fdata = self.findFields(ssqls);
                var indexes = fdata.indexes.concat(cindexes);
                indexes = indexes.concat(uindexes);
                indexes = self.arrayUnique(indexes);
                indexes = self.cleanArray(indexes);
                if (primary) {
                    fdata.pkeys.push(primary)
                }

                for (var fi = 0; fi < fdata.fields.length; fi++) {
                    for (var ii = 0; ii < indexes.length; ii++) {
                        if (!indexes[ii] || !indexes[ii].name) continue;
                        if (indexes[ii].name === fdata.fields[fi].name.replace(/"/g, '')) {
                            fdata.fields[fi].index = indexes[ii].unique;
                            delete indexes[ii];
                        }
                    }
                }

                indexes = self.cleanArray(indexes);
                table.fields = fdata.fields;
                table.indexes = indexes;
                table.pkeys = fdata.pkeys;
                tables.push(table);
            }
        }
        return tables;
    },
    renderFields : function (fields, cb) {
        'use strict';
        var sfields = [], count = fields.length;
        if (count < 1) {
            cb(sfields);
        }

        fields.forEach(function (field) {
            var row = '         ' + field.name + ': { type: schema.' + field.type;
            if (field.limit) {
                row += ', limit: ' + field.limit + '';
            }
            if (field.default) {
                switch (field.type) {
                    case 'Number':
                    case 'Integer':
                    case 'Real':
                    case 'Float':
                    case 'Boolean':

                        break;
                    default:
                        field.default = '"' + field.default + '"';
                }
                row += ', default: ' + field.default + '';
            }

            if (parseInt(field.index) > 0) {
                row += ', ' + (field.index == 1 ? 'index' : 'unique') + ' : true';
            }
            row += ' }';
            sfields.push(row);
            if (--count === 0) {
                cb(sfields)
            }
        });
    },
    splitToStrings: function (tsql) {
        'use strict';
        return tsql.split(/\n/);
    },
    findTableName: function (tsql, type) {
        'use strict';
        var tName;
        tsql = tsql.replace(/^\s+|\s+$/, '');
        if (/^CREATE\s+TABLE\s([`a-zA-Z0-9_]+)\s+\($/gim.test(tsql) ||
            /^CREATE\s+TABLE[\sa-zA-Z]+([`a-zA-Z0-9_]+)\s+\($/gim.test(tsql)) {
            tName = RegExp.$1;
        }
        tName = tName ? tName.replace(/`|"/g, '') : tName;
        return tName;
    },
    findPrimary: function (table, tsql) {
        'use strict';
        var primary, regex = new RegExp('^ALTER\\sSEQUENCE\\s(.*)OWNED\\sBY\\s' + table + '\\.([a-zA-Z0-9_]+)', 'gim');
        if (regex.test(tsql)) {
            primary = RegExp.$2;
        }
        return primary;
    },
    findIndexes: function (table, tsql, type) {
        'use strict';
        var indexes = [], result, regex = /^CREATE\sINDEX\s(.*)\sON\s(.*)\s\((.*)\)/gim;
        if (type === 3) {
            regex = /^CREATE\sINDEX\s(.*)\sON\s(.*)\sUSING\s[a-z]+\s\(([\sa-z,_]+)\)/gim;
        }
        while ((result = regex.exec(tsql)) !== null) {
            var indexN = RegExp.$1, indexT = RegExp.$2, indexF = RegExp.$3;
            indexT = indexT.replace(/`/g, '').replace(/^\s+|\s+$/, '');
            indexF = indexF.replace(/`|ASC|DESC/gi, '').replace(/^\s+|\s+$/, '');
            indexN = indexN.replace(/`/gi, '')
                .replace(/^\s+|\s+$/, '')
                .replace(new RegExp('^' + table + '_', 'i'), '');
            if (table === indexT) {
                indexes.push({
                    name: indexN,
                    columns: indexF,
                    unique: 1
                });
            }
        }
        return indexes;
    },
    findUniqueIndexes: function (table, tsql) {
        'use strict';
        var indexes = [], result, regex = /^CREATE\sUNIQUE\sINDEX\s(.*)\sON\s(.*)\s\((.*)\)/gim;
        while ((result = regex.exec(tsql)) !== null) {
            var indexN = RegExp.$1, indexT = RegExp.$2, indexF = RegExp.$3;
            indexT = indexT.replace(/`/g, '').replace(/^\s+|\s+$/, '');
            indexF = indexF.replace(/`|ASC|DESC/gi, '').replace(/^\s+|\s+$/, '');
            indexN = indexN.replace(/`/gi, '')
                .replace(/^\s+|\s+$/, '')
                .replace(new RegExp('^' + table + '_', 'i'), '');
            if (table === indexT) {
                indexes.push({
                    name: indexN,
                    columns: indexF,
                    unique: 2
                });
            }
        }
        return indexes;
    },
    findFields: function (ssql) {
        'use strict';
        var fields = [], pkeys = [], indexes = [], uniques = [];
        if (ssql && ssql.length) {
            var i = 0;
            for (var si = 0; si < ssql.length; si++) {
                var field, tsql = ssql[si].replace(/^\s+|\s+$/, '');
                if (/^`([a-zA-Z0-9_]+)`\s+([a-zA-Z0-9\(\)]+)/gi.test(tsql) ||
                    /^(?!PRIMARY\s|KEY\s|UNIQUE\s)([a-zA-Z0-9_]+)\s+([a-zA-Z0-9\(\)]+)/gi.test(tsql)) {
                    field = {
                        name: RegExp.$1,
                        type: RegExp.$2
                    };
                    var fotype = field.type;
                    if (/NOT\s+NULL/gi.test(tsql)) {
                        field.null = false;
                        field.default = '';
                    } else {
                        field.null = true;
                    }
                    if (/DEFAULT\s+'([a-zA-Z0-9-\s:]+)'/gi.test(tsql)) {
                        field.default = RegExp.$1;
                    }
                    if (/[a-zA-Z]+\(([0-9]+)\)/gi.test(fotype)) {
                        field.limit = parseInt(RegExp.$1);
                    }
                    switch (true) {
                        case /varchar/gi.test(fotype):
                        case /char/gi.test(fotype):
                            field.type = 'String';
                            if (/varying\((\d+)\)/gi.test(tsql)) {
                                field.limit = RegExp.$1;
                            }
                            break;
                        case /text/gi.test(fotype):
                            field.type = 'Text';
                            break;
                        case /tinyint/gi.test(fotype):
                        case /bool/gi.test(fotype):
                            field.type = 'Boolean';
                            break;
                        case /real/gi.test(fotype):
                        case /float/gi.test(fotype):
                            field.type = 'Float';
                            field.default = field.default ? parseFloat(field.default) : field.default;
                            break;
                        case /int/gi.test(fotype):
                            field.type = 'Number';
                            field.limit = field.limit ? field.limit : 11;
                            field.default = field.default ? parseInt(field.default) : field.default;
                            break;
                        case /datetime/gi.test(fotype):
                        case /timestamp/gi.test(fotype):
                        case /time/gi.test(fotype):
                        case /date/gi.test(fotype):
                            field.type = 'Date';
                            break;
                        default:
                            field.type = 'String';
                    }

                    if (/PRIMARY\s+KEY\s+/gi.test(tsql)) {
                        pkeys.push(field.name);
                    }

                    fields.push(field);
                } else if (/^PRIMARY\s+KEY\s+\(([`,a-zA-Z0-9_]+)\)/gi.test(tsql)) {
                    var primary = RegExp.$1;
                    primary = primary.replace(/`/g, '');
                    pkeys.push(primary);
                } else if (/^KEY\s+`([a-zA-Z0-9_]+)`\s+\(([`,a-zA-Z0-9_]+)\)/gi.test(tsql)) {
                    var index = {
                        name: RegExp.$1,
                        columns: RegExp.$2,
                        unique: 1
                    };
                    index.name = index.name.replace(/`/g, '');
                    index.columns = index.columns.replace(/`/g, '');
                    indexes.push(index);
                }
                i++;
            }
        }

        return {
            fields: fields,
            indexes: indexes,
            uniques: uniques,
            pkeys: pkeys
        };
    },
    cleanArray: function (actual) {
        var newArray = [];
        for (var i = 0; i < actual.length; i++) {
            if (actual[i]) {
                newArray.push(actual[i]);
            }
        }
        return newArray;
    },
    arrayUnique: function (array) {
        var a = array.concat();
        for (var i = 0; i < a.length; ++i) {
            for (var j = i + 1; j < a.length; ++j) {
                if (a[i] === a[j])
                    a.splice(j--, 1);
            }
        }
        return a;
    }
};