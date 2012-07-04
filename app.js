//  *************************************************
//  VARS & SETUP
//  ssh -L5984:127.0.0.1:5984 root@recyclerobot.com
//  *************************************************

var express = require('express'),
    db    = require('nano')('http://localhost:5984'),
    app     = module.exports = express.createServer(),
    nerdlabDB = db.use('nerdlab');


//  *************************************************
//  HTTP RESPONS
//  *************************************************

app.get("/", function(req,res) {
  res.send("welcome to the matrix");
});


app.get("/PUT/:something/:element/:the_value", function(req,res) {

  //  *************************************************
  //  NANO COUCH DB CONTROLLER
  //  *************************************************
  var sm = req.params.something;
  var elm = req.params.element;
  var val = req.params.the_value;

  nerdlabDB.get(sm, function(err, body, head) {
    // #todo: checken met een head getter, less memory en slightly faster

    if(head){
      // YAY BESTAAT
      console.log(body);
      if(val.charAt(0) == "+"){
        body[elm] = parseInt(body[elm])+parseInt(val.substring(1));
      }else if(val.charAt(0) == "-"){
        body[elm] = parseInt(body[elm])-parseInt(val.substring(1));
      }else{
        body[elm] = val;
      }
      nerdlabDB.insert(body,function(err, body) {
      if(err) {console.log(err); }
          console.log("inserted");
          res.send('<head><style type="text/css">body {background: #000; color: #00ff00; padding: 40px; font-family: "Andale Mono", serif;}</style></head><body>Inserted into '+sm+' for '+elm+' value: '+val+' <br><br>total= '+body[elm]+'</body>');
        }
      );
    }else{
      // BESTAAT NOG NIKS VAN
      console.log(elm);
      var new_doc = {};
      new_doc[elm] = parseInt(val); // de +'' is een toString() conversion omdat couchDB een UTF8 only db type is
      
      nerdlabDB.insert(new_doc, sm,function(err, body) {
        if(err) {
          console.log(err);
        }else{
          console.log("inserted");
          res.send('<head><style type="text/css">body {background: #000; color: #00ff00; padding: 40px; font-family: "Andale Mono", serif;}</style></head><body>Inserted into '+sm+' for '+elm+' value: '+val+'</body>');
          console.log("--------------------");
        }
      });

    }
    
  });
  


}); // close app function response


app.get("/GET/:something", function(req,res) {

  var sm = req.params.something;
  //var elm = req.params.element;
  //var val = req.params.the_value;


  nerdlabDB.get(sm, function(err, body) {
    if (!err) {
      res.send(body); 
    }else{
      console.log(err);
      res.send("nothing found");
    }
  });
  
}); // close app function response

app.listen(4567);
console.log("server is running. check expressjs.org for more cool tricks");

