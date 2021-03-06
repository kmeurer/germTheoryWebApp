var ReportedCase = require('../database/dbSchema').ReportedCase;
var Disease = require('../database/dbSchema').Disease;
var moment = require('moment');
var diseaseController = require('./diseaseController.js');

module.exports = {

  getAllReportedCases: function(req, res, next) {
    ReportedCase.findAll({ include: [ Disease ] ,limit: 100 })
      .success(function(reportedCases) {
        res.status(200).send(reportedCases);
      });
  },

  getReportedCase: function(req, res, next) {
    ReportedCase.find(req.params.id).then(function(reportedCase) {
      res.status(200).send(reportedCase);
    });
  },

  createNewCase: function(req, res, next) {
    if( req.body.date ){
      var splitDate = req.body.date.split('/');
      var newDate = new Date(splitDate[2], splitDate[0] - 1, splitDate[1]);
    } else {
      var newDate = new Date();
    }

    ReportedCase.create({
      disease_id: parseInt(req.body.disease_id),
      latitude: parseFloat(req.body.latitude),
      longitude: parseFloat(req.body.longitude),
      date: newDate,
      description: req.body.description })
      .success(function(reportedCase) {
        res.setHeader('Content-Type', 'application/json');
        res.status(201).redirect('/cases');
      })
      .error(function(err) {
        res.status(400).send({ error: err.name, message: err.message });
      });
  },

  showAllReportedCase: function(req, res, next) {
    ReportedCase.findAll({ include: [ Disease ], order: 'created_at DESC' }).
      success(function(reportedCases) {
        var sortedCases = [];
        for(var i = 0; i < reportedCases.length; i++){
          reportedCases[i].dataValues.date = moment(reportedCases[i].dataValues.date);
          sortedCases.push(reportedCases[i]);
        }
        sortedCases.sort(function(a, b){
          if(a.dataValues.date.isBefore(b.dataValues.date)){
            return 1;
          } else {
            return -1;
          }
        })
        for( var i = 0; i < sortedCases.length; i++){
          sortedCases[i].dataValues.date = moment(sortedCases[i].dataValues.date).format('MMMM Do, YYYY')
        }
        res.render('reportedCases', { cases: sortedCases });
      });
  },

  newReportedCase: function(req, res, next){
    diseaseController.getAllDiseases(function(diseases){
      res.render('newReportedCase', { diseases: diseases } )
    });
  }
};
