var utils = require('@arimuscorp/utils');
var errorHandler = require('@arimuscorp/error-handler');
var errors = require('./lib/errors.json');
errorHandler.addErrors(errors);

module.exports = function(dependencies){
  var introductionDb = dependencies.introduction
  var introduction = {};

  introduction.create = function(){
    introductionDb.create.apply(introductionDb, arguments);
  };

  introduction.getById = function(id, cb){
    introductionDb.getById(id, cb)
  }

  introduction.getNew = function(){
    var intArgs = utils.resolve4Arguments(arguments);
    var uid = intArgs[0];
    var last_time = intArgs[1];
    var options = intArgs[2];
    var cb = intArgs[3];
    var query = {recipient:uid, $gt:{change_time:last_time}};
    options.$sort = {change_time:1};
    if (!options.limit) return cb({errCode:'5b2b8e590d3be507b6526ce2'});
    introductionDb.find(query, {}, options, function(err, introductions, last_item){
      if (err) return cb(err);
      var responseObj = {introductions:[]};
      if (introductions.length === options.limit) {
        responseObj.last_item = introductions[introductions.length - 2]._id;
        introductions.pop();
      }
      responseObj.introductions = introductions;
      var returnObj = {response:responseObj, items:introductions};
      return cb(err, returnObj);
    })
  };

  return introduction;
};