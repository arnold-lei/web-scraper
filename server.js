var express     = require('express');
var exphbs      = require('express-handlebars');
var app         = express();
var mongoose    = require('mongoose');
var cheerio     = require('cheerio');
var request     = require('request');
var bodyParser  = require('body-parser');
var PORT        = 3000

//Require Article Schema
var Article = require('./models/Article.js');

mongoose.connect('mongodb://localhost/scrapper');
var db = mongoose.connection;

db.on('error', function(err) {
    console.log('Mongoose Error: ', err);
});

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

db.once('open', function() {
    console.log('Mongoose connection successful.');
});

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.get('/', function(req, res) {
    // We will find all the records, sort it in descending order, then limit the records to 5
    Article.find({}).sort([
            ['date', 'descending']
        ]).limit(10)
        .exec(function(err, doc) {

            if (err) {
                console.log(err);
            } else {
                console.log(doc)
                res.render('home', {article: doc})
            }
        })
});

app.post('/post', function(req, res){
    console.log(req.body);
    res.send(req.body)
    // Article.remove({
    //     _id: res.body._id
    // },{
    //     justOne: true
    // })
})

//running request here:
request('https://www.reddit.com/r/mma', function(error, res, html) {
    var $ = cheerio.load(html);
    $('a.title').each(function(i, element) {
        var title = element.children[0].data
        var link = element.attribs.href
        console.log(title + ': ' + link + '\n');
        Article.create({
            title: title,
            link: link,
            date: Date.now()
        }, function(err) {
            if (err) {
                console.log(err)
            }
        })
    })


})

app.listen(PORT, function(err) {
    if (err) {
        console.error(err);
    } else {
        console.info("==> Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
    }
});
