var path           = require('path')
  , csv            = require('csv')
  , fs             = require('fs')
  , emailvalidator = require("email-validator");

var myConfig = require('./config');

var input = fs.createReadStream(myConfig.from);
var output = fs.createWriteStream(myConfig.to);

var parser = csv.parse({delimiter: ';', columns: true});

var transformer = csv.transform(function(data, callback){
  setImmediate(function(){
  	var valid = (emailvalidator.validate(data[myConfig.fieldNames.email])) ? "1" : "0";
  	if (!emailvalidator.validate(data[myConfig.fieldNames.email])) {
  		console.log("Inválido!");
  	}
  	data[myConfig.fieldNames.result] = valid;
    callback(null, data);
  });
}, { parallel: 20 });

var stringifier = csv.stringify({ header: true });

input.pipe(parser).pipe(transformer).pipe(stringifier).pipe(output);
