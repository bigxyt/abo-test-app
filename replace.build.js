/*
 * Copyright (c) 2023 big xyt AG
 * All rights reserved.
 */
 
var replace = require('replace-in-file');
var fns = require('date-fns');
var timestamp = fns.format(new Date(), "yyyy-MM-dd'T'H:mm:ss");
// var timestamp = moment().format('YYYY-MM-DDTHH:mm:ss');
var buildVersion = `${process.argv[2]}, ${process.argv[3]}, ${timestamp}`;
const options = {
  files: './dist/assets/config/config.json',
  from: /{BUILD_VERSION}/g,
  to: buildVersion,
  allowEmptyPaths: false,
};

try {
  replace.sync(options);
  console.log('Build version set: ' + buildVersion);
} catch (error) {
  console.error('Error occurred:', error);
}
