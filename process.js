#! /usr/local/bin/node
var util = require('util');
var sys = require('sys');
var childProcess = require('child_process');
var fs = require('fs');
var CronJob = require('cron').CronJob;

var filterArgument = (process.argv[ 2 ] || '');

// switch(filterArgument){
//   case '':
//     cronStart();
//     process.exit(1);
//     break;

//   case '--test':
//     console.log('test');
//     break;

//   default:
//     //util.puts('Flag not recognized.');
//     //util.puts('Use: ./process.js');
//     //console.log('Flag not recognized.');
//     //console.log('Use: ./process.js');
//     process.exit(1);
//     break;
// }

var count = 0;
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
  console.log('see every 5 sec ', count);
  if(count > 8){
    job.stop();
  }
  });
} catch(ex) {
    console.log('cron pattern not valid');
}
job.start();





// childProcess.exec('top -l 3 -F -R -o cpu > text/top3Results.txt', function(error, stdout, stderr){
//   if(error != null){
//     console.log('exec error: ', error);
//   }
//   else{
//     parseData(setData);
//   }
// });

parseData = function(){ // data or file name
  var top6 = [];
  fs.readFile('./text/top3Results.txt', 'utf8', function(err, data){
    if(err){throw err;}

    var iterations = data.replace(/[%#]/g, '').split(/Processes: /).join('\n\nProcesses: ').trim().split('\n\n');
    var array = iterations[5].toString().split('\n');
    var headline = array[0].trim().split(/[\s]+/g);  // get headers
    array.shift() // remove header from array  

    for(var i = 0; i < 6; i++){
      var line = array[i].trim().split(/[\s]+/g);
            
      if(line.length > 28){
        line.splice(2,(line.length-28));
      }

      top6.push({});
      for(var j = 0; j < line.length; j++){
        top6[i][headline[j]] = line[j];
      }
    }

    fs.writeFile('./text/top6-data.json', JSON.stringify(top6), function(err){
      if(err){console.log(err);}
    });
  });
  //openInBrowser();
}


/* Function opens the HTMl file in the browser with CORS turned off */
openInBrowser = function(){
  childProcess.exec('open -a "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" index.html --args --allow-file-access-from-files', function(error, stdout, stderr){
    if(error != null){
      console.log('exec error: ', error);
    }
    else{
      console.log('File opened in browser.')
    }
  });
}




