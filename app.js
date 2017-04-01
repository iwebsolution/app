var express = require('express');
var pageControler = require('./controllers/pageControler');


var app = express();

app.set('view engine', 'ejs');
app.use(express.static('./assets'));




// var urlencodedParser = bodyParser.urlencoded({ extended: false });
//
// app.post('/twilioApi', urlencodedParser, function(req, res){
// console.log(req.body);
// });
pageControler(app);

app.listen(80);
console.log('running on port 80 aka localhost');
