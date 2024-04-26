var http = require('http');
var querystring = require('querystring');
const {SerialPort} = require('serialport');
var mewtocol = require('mewtocol-serial');

//Serial port code here default port is COM1
const defaultport = "COM1";
const defaultBaudRate = 9600;
const port = new SerialPort({ path: defaultport, baudRate:defaultBaudRate, autoOpen: false });
port.open(function (err) {
  if (err) {
    console.log('Port open fail: ' + err.message + "\n");
    return;
    }
  console.log(defaultport + ' open sucesses.' + "\r");
  });
port.on('error', err => {
  console.log('There is an error: ' + err.message + "\n");
});
//ReadMessage
port.on('data', data => {
  serialportreturn = data;
  console.log('Data received: ' + data + "\n");
});

var serialportreturn = '';

let postHtml1 = 
'<html><head><meta charset="utf-8"><title>Panasonic mewtocol web clietn</title></head>'+
'<body>' +
'<div>A browser ui version of mewtocol serial</div><br>'+
'Command current support is ON/OFF, you could use command like this (R1,ON) or (R1,OFF)<br>'+
'<form method="post">' +
'Command Input: <input name="cmd"><br>' +
'<input type="submit">'+
'</form>'
let postHtml2 = '</body></html>';

//Server
http.createServer(function (req, res) {
    let body = "";

    req.on('data', function (chunk) {
      body += chunk;
    });
    req.on('end', function () {
      body = querystring.parse(body);
      res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
   
      if(body.cmd) {
          var spr = body.cmd;
          var result = spr.split(',');
          if(result[1]='ON')
          {
            mewtocol.RelayON(result[0]);
          }else
          {
            mewtocol.RelayOff(result[0]);
          }
          res.write(postHtml1+
            "Response: "+serialportreturn+"<br>"+
            postHtml2);
      } else {
          res.write(postHtml1+postHtml2);
      }
      res.end();
    });
  }).listen(80);