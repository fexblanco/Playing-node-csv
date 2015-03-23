var path           = require('path')
  , csv            = require('csv')
  , fs             = require('fs')
  , crypto         = require('crypto');

var myConfig = require('./config');

var input = fs.createReadStream(myConfig.from);
var output = fs.createWriteStream(myConfig.to);

var parser = csv.parse({delimiter: ';', columns: true});

var transformer = csv.transform(function(data, callback){
  setImmediate(function(){
    var shasum = crypto.createHash('sha1');
    shasum.update(myConfig.salt + data[myConfig.fieldNames.toSha1]);
    data[myConfig.fieldNames.sha1] = shasum.digest('hex');
    callback(null, data);
  });
}, { parallel: 20 });

var stringifier = csv.stringify({ header: true });

input.pipe(parser).pipe(transformer).pipe(stringifier).pipe(output);