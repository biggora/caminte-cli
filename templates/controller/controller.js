/**
 *  <?= controllerName ?> Routes
 *
 *  Created by create model script
 *  App based on CaminteJS
 *  CaminteJS homepage http://www.camintejs.com
 **/

module.exports = {
    /**
     * Index action, returns a list either
     * Default mapping to GET '/:table'
     *
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     **/
    'index': function (req, res) {
        var query = req.query;
        var skip = query.skip ? parseInt(query.skip) - 1 : 0;
        var limit = query.limit ? parseInt(query.limit) : 20;
        var total = 0;

        var opts = {
            skip: skip,
            limit: limit,
            where: {}
        };

        Model.count(opts.where, function (err, count) {
            total = count;
            Model.all(opts, function (err, users) {
                if (err) {
                    res.status(400);
                    return res.json({
                        status: 400,
                        error: err
                    });
                }
                res.status(200);
                res.json(users);
            });
        });
    },
    /**
     * Show action, returns shows a single item
     * Default mapping to GET '/:table/:id'
     *
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     **/
    'show': function (req, res) {
        Model.findById(req.params.id, function (err, item) {
            if (err) {
                res.status(400);
                return res.json({
                    status: 400,
                    error: err
                });
            }
            if (item) {
                res.status(200);
                res.json({
                    status: 200,
                    data: item.toObject()
                });
            } else {
                res.status(404);
                res.json({
                    status: 404,
                    error: "NotFound"
                });
            }
        });
    },
    /**
     * Update action, updates a single item
     * Default mapping to PUT '/:table/:id', no GET mapping
     *
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     **/
    'update': function (req, res) {
        Model.findById(req.params.id, function (err, item) {
            if (err) {
                res.status(400);
                return res.json({
                    status: 400,
                    error: err
                });
            }
            if (item) {
                item.updateAttributes(filtered, function (err) {
                    if (err) {
                        res.status(400);
                        return res.json({
                            status: 400,
                            error: err
                        });
                    }
                    res.status(200);
                    res.json({
                        status: 200,
                        data: item.toObject()
                    });
                });

            } else {
                res.status(404);
                res.json({
                    status: 404,
                    error: "NotFound"
                });
            }
        });
    },
    /**
     * Create action, creates a single item
     * Default mapping to POST '/:table', no GET mapping
     *
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     **/
    'create': function (req, res) {
        var item = new Model(filtered);
        item.isValid(function (isValid) {
            if (!isValid) {
                res.status(400);
                return res.json({
                    status: 400,
                    error: item.errors
                });
            }

            item.save(function (err) {
                if (err) {
                    res.status(400);
                    return res.json({
                        status: 400,
                        error: err
                    });
                }
                res.status(201);
                res.json({
                    status: 201,
                    data: item.toObject()
                });
            });
        });
    },
    /**
     * Delete action, deletes a single item
     * Default mapping to DEL '/:table/:id', no GET mapping
     *
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     **/
    'destroy': function (req, res) {
        Model.findById(req.params.id, function (err, item) {
            if (err) {
                res.status(400);
                return res.json({
                    status: 400,
                    error: err
                });
            }
            item.destroy(function (err) {
                if (err) {
                    res.status(400);
                    return res.json({
                        status: 400,
                        error: err
                    });
                } else {
                    res.status(204);
                    res.json({
                        status: 204,
                        message: 'Item deleted!'
                    });
                }
            });
        });
    },
    /**
     * Delete action, deletes a all items
     * Default mapping to DEL '/:table', no GET mapping
     *
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     **/
    'destroyall': function (req, res) {
        Model.destroyAll(function (err) {
            if (err) {
                res.status(400);
                return res.json({
                    status: 400,
                    error: err
                });
            } else {
                res.status(204);
                res.json({
                    status: 204,
                    message: 'Items deleted'
                });
            }
        });
    }
};