var express     = require('express');
var exphbs      = require('express-handlebars');
var app         = express();
var mongoose    = require('mongoose');
var cheerio     = require('cheerio');
var request     = require('request');
var PORT        = 3000

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

//running request here:
request('https://www.reddit.com/r/mma', function(error, res, html){
    var $ = cheerio.load(html);
    $('a.title').each(function(i, element){
        var title = element.children[0].data
        console.log(element.children[0].data);
    })
})

app.listen(PORT, function(err){
    if (err) {
        console.error(err);
    } else {
        console.info("==> Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
    }
});
