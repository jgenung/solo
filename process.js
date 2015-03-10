#! /usr/local/bin/node
var util = require('util');
var sys = require('sys');
var childProcess = require('child_process');
var fs = require('fs');
var CronJob = require('cron').CronJob;
var filterArgument = (process.argv[ 2 ] || '');
var filter = '';
var browser = false;

/* Handle flag options */
switch(filterArgument){
  case '':
    console.log('\nRunning process visualizer!');
    //cronStart();
    //process.exit(1);
    break;

  case '--test':
    console.log('\nRunning in test mode.');
    filter = 'test';
    break;

  case '--firefox':
    console.log('\nfirefox flag set');
    filter = 'firefox';
    break;
  case '--chrome':
    console.log('\nchrome flag set');
    filter = 'chrome';
    break;

  case '--h': case '--help': case '-h': case '-help':
    console.log('\nUse: node process.js');
    console.log('\nFlags: ');
    console.log('       --chrome   open in chrome');
    console.log('       --firefox  open in firefox');
    console.log('       --test     run in test mode\n');
    process.exit(1);
    break;

  default:
    console.log('\nFlag not recognized.');
    console.log('\nUse: node process.js\n');
    process.exit(1);
    break;
}

var count = 0;
var limit = 10;

/* Set cronjob to run every 5 seconds for 'count' iterations */
try {
  var job = new CronJob('*/5 * * * * *', function() {
    childProcess.exec('top -l 3 -F -R -o cpu > text/top3Results.txt', function(error, stdout, stderr){
      if(error != null){
        console.log('exec error: ', error);
      }
      else{
        parseData();
      }
    });

  count++;

  if(filter === 'test'){
    console.log('cron runs every 5 seconds for', limit, 'iterations, current iteration: ', count);
  }

  if(count === limit){
    job.stop();
  }

  });
} catch(ex) {
    console.log('cron pattern not valid');
}
job.start();


/* Read in data and parse into json object and write to file */
parseData = function(){ 

  var top6 = [];         // store array og objects

  // Read in results of top command
  fs.readFile('./text/top3Results.txt', 'utf8', function(err, data){
    if(err){throw err;}

    var iterations = data.replace(/[%#]/g, '')        // parse process information for 3 iterations of top
                         .split(/Processes: /)
                         .join('\n\nProcesses: ')
                         .trim()
                         .split('\n\n');

    var array = iterations[5].toString().split('\n'); // parse third iteration of top command

    var headline = array[0].trim().split(/[\s]+/g);   // parse headers
    array.shift()                                     // remove header from array  

    for(var i = 0; i < 6; i++){
      var line = array[i].trim().split(/[\s]+/g);
            
      if(line.length > 28){
        line.splice(2,(line.length-28));              // splices data that was parsed incorrectly
      }

      top6.push({});

      for(var j = 0; j < line.length; j++){
        top6[i][headline[j]] = line[j];               // creates json object
      }
    }

    // writes josn object to file
    fs.writeFile('./text/top6-data.json', JSON.stringify(top6), function(err){
      if(err){console.log(err);}
    });
  });

  if(!browser){
    openInBrowser();
  }
}


/* Function opens the HTMl file in the browser with CORS turned off */
openInBrowser = function(){
  browser = true;
  // Open html file in Chrome
  if(filter === 'chrome'){
    childProcess.exec('open -a "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" index.html --args --allow-file-access-from-files', function(error, stdout, stderr){
      if(error != null){
        console.log('exec error: ', error);
      }
      else{
        console.log('\nFile opened in browser.')
      }
    });
  }

  // Open html file in Firefox
  else if(filter ==='firefox'){
    childProcess.exec('open -a "/Applications/Firefox.app/" index.html', function(error, stdout, stderr){
      if(error != null){
        console.log('exec error: ', error);
      }
      else{
        console.log('\nFile opened in browser.')
      }
    });
  }
  // else{
  //   console.log('Browser not selected\n');
  // }
}




