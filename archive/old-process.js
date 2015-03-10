#! /usr/local/bin/node
// open -a "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --args --allow-file-access-from-files
var util = require("util");
var sys = require("sys");
var childProcess = require("child_process");
var fs = require("fs");
var CronJob = require('cron').CronJob;

var filterArgument = (process.argv[ 2 ] || "");
var filterTag = null;
var headers = [];
var processObject = {};
var top6Processes = {};
var info;


// # .---------------- minute (0 - 59)
// # |  .------------- hour (0 - 23)
// # |  |  .---------- day of month (1 - 31)
// # |  |  |  .------- month (1 - 12) OR jan,feb,mar,apr ...
// # |  |  |  |  .---- day of week (0 - 6) (Sunday=0 or 7) OR sun,mon,tue,wed,thu,fri,sat
// # |  |  |  |  |
// # *  *  *  *  * user-name  command to be executed

var count = 0;
try {
  var job = new CronJob('*/5 * * * * *', function() {
    childProcess.exec('top -l 3 -F -R -o cpu > text/top3Results.txt', function(error, stdout, stderr){
      if(error != null){
        console.log('exec error: ', error);
      }
      else{
        parseData(setData);
      }
    });
  count++;
  console.log("see every 5 sec ", count);
  if(count > 5){
    job.stop();
  }
  });
} catch(ex) {
    console.log("cron pattern not valid");
}
job.start();

//var minutes = 1, the_interval = minutes * 60 * 1000;
// setInterval(function() {

//   childProcess.exec('top -l 3 -F -R -o cpu > text/top3Results.txt', function(error, stdout, stderr){
//   if(error != null){
//     console.log('exec error: ', error);
//   }
//   else{
//     parseData(setData);
//   }
//   });

// }, the_interval);

// switch(filterArgument){
//   case "":
//     filterTag = null;
//     break;

//   case "--test":
//     console.log("test");
//     break;

//   default:
//     //util.puts("Flag not recognized.");
//     //util.puts('Use: ./process.js');
//     //console.log("Flag not recognized.");
//     //console.log('Use: ./process.js');
//     process.exit(1);
//     break;
// }

/* every 10 seconds
setInterval(function(){...}, 10*1000);
*/

// childProcess.exec('top -l 3 -F -R -o cpu > text/top3Results.txt', function(error, stdout, stderr){
//   if(error != null){
//     console.log('exec error: ', error);
//   }
//   else{
//     parseData(setData);
//   }
// });

parseData = function(callback){ // data or file name
  var top6 = [];
  fs.readFile('./text/top3Results.txt', 'utf8', function(err, data){
    if(err){throw err;}

    //data = data.replace(/[%#]/g, '').split(/Processes: /).join("\n\nProcesses: ").trim();
    //data = data.split(/Processes: /).join("\n\nProcesses: ").trim();
    var iterations = data.replace(/[%#]/g, '').split(/Processes: /).join("\n\nProcesses: ").trim().split("\n\n");
    //var iterations = data.split("\n\n");
    //console.log(iterations[5]);
    //return;
    //var info = iterations[4].toString().trim().split('\n');
    var array = iterations[5].toString().split("\n");
    var headline = array[0].trim().split(/[\s]+/g);  // get headers

    //var pObject = [];
    //var top6 = [];
    array.shift() // remove header from array  

    for(var i = 0; i < 6; i++){
      var line = array[i].trim().split(/[\s]+/g);
            
      if(line.length > 28){
        line.splice(2,(line.length-28));
      }

      //pObject.push({});
      top6.push({});
      for(var j = 0; j < line.length; j++){
        //pObject[i][headline[j]] = line[j];
        //if(i < 6){
        top6[i][headline[j]] = line[j];
        //}
      }
    }


    // for(var i = 0; i < array.length; i++){
    //   var line = array[i].trim().split(/[\s]+/g);
            
    //   if(line.length > 28){
    //     line.splice(2,(line.length-28));
    //   }

    //   pObject.push({});
    //   if(i < 6){ top6.push({}); }
    //   for(var j = 0; j < line.length; j++){
    //     pObject[i][headline[j]] = line[j];
    //     if(i < 6){
    //       top6[i][headline[j]] = line[j];
    //     }
    //   }
    // }
    //callback(pObject, top6, headline);
    //callback(top6);
        fs.writeFile('./text/top6-data.json', JSON.stringify(top6), function(err){
    if(err){console.log(err);}
    });
  });
  //openInBrowser();
}


setData = function(top6){
  //headers = headline;
  //processObject = pObject;
  // top6Processes = top6;

  // fs.writeFile('./text/top6-data.json', JSON.stringify(top6), function(err){
  //   if(err){console.log(err);}
  // });

  // fs.writeFile('./text/processes.json', JSON.stringify(processObject), function(err){
  //   if(err){console.log(err);}
  // });

  //openInBrowser();
}


openInBrowser = function(){
  childProcess.exec('open -a "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" index.html --args --allow-file-access-from-files', function(error, stdout, stderr){
    if(error != null){
      console.log('exec error: ', error);
    }
    else{
      
    }
  });
}




