
const db = require('../models');
const axios = require('axios');
const cheerio = require('cheerio');

exports.index = (req, res) => {
    res.render('home');
};

exports.savedArticle = (req, res) => {

    db.Articles.find({}). // Find all Saved Articles
    then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.render('index',{dbArticle:dbArticle});
    }).catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
    });
};


exports.searchArticel = (req, res) => {
    //axios.get("https://www.nytimes.com/section/business").then(response => {
    axios.get("https://www.nytimes.com/section/health").then(response => {
        let $ = cheerio.load(response.data),
            //homeUrl = "https://www.nytimes.com/section/business",
            handlebarsObject = {
                data: []
            };
        $("article").each((i, element) => {

            let ImageURL    = $(element).children('figure').children('a').children('img').attr('src'),
                headline    = $(element).children('.css-10wtrbd').children('h2').children('a').text(),
                summary     = $(element).children('.css-10wtrbd').children('p').text(),
                url         = $(element).children('.css-10wtrbd').children('h2').children('a').attr('href'),
                //dateTime    = $(element).children('.css-10wtrbd').children('p.css-1lwiyax:first-child'),
                author      = $(element).children('.css-10wtrbd').children('p.css-1lwiyax').children('span.css-9voj2j').children('span.css-1baulvz').text();


            if (headline) {
                handlebarsObject.data.push({
                    headline: headline,
                    summary: summary,
                    url: url,
                    imageURL: ImageURL,
                    slug: author,
                    comments: null
                });
                /*db.Articles.findOne({headline: headline})
                    .then(article => {
                        if(!article) {
                            handlebarsObject.data.push({
                                headline: headline,
                                summary: summary,
                                url: url,
                                imageURL: ImageURL,
                                slug: author,
                                comments: null
                            });
                        }

                        return handlebarsObject;

                    }).catch(err => {
                    res.json(err)
                });*/
            }

        });

        res.render("article", handlebarsObject);

    })
};


exports.addArticel = (req, res) => {
    let articleObject = req.body;

    db.Articles.findOne({url: articleObject.url})
        .then(article => {
            if(!article) {
                db.Articles.create(articleObject)
                    .then((response) => {
                        res.json(response)
                    }).catch(err => {
                        res.json(err)
                    });
            }else{
                res.json("Already exists");
            }

        }).catch(err => {
            res.json(err)
        });
};

exports.addComment = (req, res) => {
    let noteBody = req.body;
    let note = {
        body:noteBody.body
    }

    db.Notes.create(note).then(function(dbNote) {
        return db.Articles.findOneAndUpdate({
            _id: noteBody.articleId
        }, {
            $push: {
                note: dbNote._id
            }
        });
    }).then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
    }).catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
    });
};


exports.allNotes = (req, res) => {
    db.Articles.findOne({_id: req.body.articleID}).populate("Note").
    then((response) => {
        if (response.note.length == 1) {
            db.Notes.findOne({'_id': response.note}).then((comment) => {
                comment = [comment];
                res.json(comment);
            });

        } else {
            db.Notes.find({
                '_id': {
                    "$in": response.note
                }
            }).then((comments) => {
                res.json(comments);
            });
        }
    }).catch(function(err) {
        res.json(err);
    });
};

exports.deleteArticle = (req,res) =>{
    let articleId = req.body.articleId;
    db.Articles.findByIdAndRemove(articleId). // Look for the Comment and Remove from DB
    then(response => {
        if (response) {
            res.json("success");
        }
    });
};

exports.deleteComment = (req,res) =>{
    let commentId = req.body.commentId;
    db.Notes.findByIdAndRemove(commentId)
        .then(response => {
        if (response) {
            res.json("success");
        }
    });
};
