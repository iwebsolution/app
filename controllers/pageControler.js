var bodyParser = require('body-parser');
var plivo = require('plivo');
var api = plivo.RestAPI({
    authId: 'XXX',
    authToken: 'XXX',
});


var appStatus = "";
var callEvents;

function callback(err, response) {
    if (err) {
        console.log(err);
    } else {
        console.dir(response);
    }
}; //end callback function
function getRandom(length) {
    var prefix = '+46';
    var math = Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
    var res = prefix + math;
    return res;

} //end getRandom

var callEvent = function(callId, machine, direction, calledNumber, duration, totalCost, callStatus, finalEvent) {
    callEvents = {
        callId: callId,
        machine: machine,
        direction: direction,
        calledNumber: calledNumber,
        duration: duration,
        totalCost: totalCost,
        callStatus: callStatus,
        finalEvent: finalEvent
    };
}; // end callEvents




function random(items) {
    return items[Math.floor(Math.random() * items.length)];
}; // end random function

let callAgain = function(callingToNumber) {
  var params = {
      from: getRandom(10).toString(),
      to: callingToNumber,
      answer_url: 'http://138.68.108.180/answer',
      answer_method: 'GET',
      ring_timeout: 10,
      machine_detection: 'true',
      machine_detection_url: 'http://138.68.108.180/update',
      hangup_url: 'http://138.68.108.180/update',
  };

  api.make_call(params, function(status, response) {
      if (status >= 200 && status < 300) {
          console.log('Successfully made call request.');
          console.log('Response:', response);
      } else {
          console.log('Oops! Something went wrong.');
          console.log('Status:', status);
          console.log('Response:', response);
      }
  }); //end call

}; //end function call again




module.exports = function(app) {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: false
    }));

    app.get('/app', function(req, res) {
        res.render('app');

    });



    app.post('/update', function(req, res) {
        var totalCost = req.body.TotalCost;
        var direction = req.body.Direction;
        var duration = req.body.Duration;
        var calledNumber = req.body.To;
        var callStatus = req.body.CallStatus;
        var machine = req.body.Machine;
        var finalEvent = req.body.Event;
        var callId = req.body.CallUUID;

        console.log(callId, machine, direction, calledNumber, duration, totalCost, callStatus, finalEvent);

        if(machine == 'true' && callStatus == 'completed' && appStatus == 'on'){
          setTimeout(function(){
            callAgain(calledNumber);
          }, 300000);
          callEvent(callId, machine, direction, calledNumber, duration, totalCost, callStatus, finalEvent);
        }else if (callStatus == 'cancel' && appStatus == 'on'){
          callAgain(calledNumber);
        }else if(callStatus == 'busy' && appStatus == 'on'){
          callAgain(calledNumber);
        }else if(callStatus == 'no-answer' && appStatus == 'on'){
          callAgain(calledNumber);
        }else if(callStatus == 'completed' && appStatus == 'on'){
          callAgain(calledNumber);
        }else if (callStatus == 'timeout' && appStatus == 'on'){
          callAgain(calledNumber);
        };

        res.send('OK');
    }); // end update

    app.post('/api', function(req, res) {
        var data = req.body;

        callTo = data.callTo;
        callFrom = data.callFrom;
        appStatus = data.appStatus;
        let toN = callTo.split(',');
      //  let fromN = callFrom.split(',');

        for (i = 0; i < toN.length; i++) {
        callAgain(toN[i]);
        }; //end loop

        res.send("Am inceput sa sun");

    }); //end post api


    app.post('/stop', function(req, res) {
        var data = req.body;
        appStatus = data.appStatus;
        console.log(appStatus);
        res.send("Stop request initiated ")
    }); //end app post stop

    app.post('/getdata', function(req, res) {

        res.send(callEvents);
    }); //end app post stop

    app.get('/answer', function(req, res) {

        var r = plivo.Response();
        var params = {
            'length': "55",
            'silence': "true",
            'minSilence': "55000"
        };
        r.addWait(params);
        res.set({'Content-Type': 'text/xml'});
        res.send(r.toXML());
    });

}; //end exports
