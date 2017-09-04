module.exports = app => {
    
  var path = require('path');
  var fs = require('fs');

  app.get('/api/whoami', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(whoAmI(req));
  });
    
  // index.html appear to browser
  app.get('/', (req, res) => {
      var fullUrl = req.protocol + '://' + req.get('host');

      fs.readFile(path.join(__dirname + '/../public/index.html'), 'utf-8', function(err, data){
          if (err) throw err;

          res.setHeader('Content-Type', 'text/html');
          res.send(data.split('${fullUrl}').join(fullUrl));
      });
  });
  app.get('/styles.css', (req, res) => {
      res.sendFile(path.join(__dirname + '/../public/styles.css'));
  });
}

function whoAmI(req) {
  var ipaddress = req.headers['x-forwarded-for'] ||
  req.headers['X-Forwarded-For'] ||
  req.connection.remoteAddress ||
  req.socket.remoteAddress ||
  req.connection.socket.remoteAddress;

  var language = req.headers["accept-language"];
  var software = uaParser(req.headers['user-agent']);

  return {ipaddress: ipaddress.split(',')[0],
          language: language.split(',')[0], 
          software
  }
}

function uaParser(str) {
  const regex = /(?=\()(.*?)(?=\))/g;
  let match;
  
  while ((match = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (match.index === regex.lastIndex) {
        regex.lastIndex++;
    }
    
    // The result can be accessed through the `m`-variable.
    if (match.length > 0) {
      return match[0].replace('(', '');
    }
    return;
  }
}