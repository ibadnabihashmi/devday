var _ = require('lodash');
var async = require('async');
var User = require('../models/User');
var express = require('express');
var router = express.Router();


function render(req,res){
    res.render('WH', {
        title: 'setplan'
    });
}

router.get('/',render);

module.exports = router;