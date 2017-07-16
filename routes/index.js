var express = require('express');
var request = require('request');
var cheerio = require('cheerio');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/author/:author/title/:title', function(req, res){

  console.log(req.params);

  url = "https://scholar.google.com.sg/scholar?hl=en&q=" + req.params.author +"+" + req.params.title;

  console.log("Result URL : " + url);

  request(url, function(err, response, html){
    
    var found = false;

    if (!err){
      // if no error
      
      // get jQuery like
      var $ = cheerio.load(html);

      $('.gs_fl').filter(function(){

        var text = $(this).children().first().text().toString();

        // console.log(text);
        // console.log(text.indexOf("Cited by"));
        
        if (!found){
          if (text.indexOf("Cited by") != -1){
            // found the answer
            found = true;
            res.send(text);
          }
        }

      });

      if (!found){
        res.send("No Record Found!");
      }

    }else{
      console.log("Error : " + err);
      res.sendStatus(500);
    }
  });

});

module.exports = router;
