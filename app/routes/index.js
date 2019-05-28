

module.exports = (app) => {
    const controller = require('../controllers/scrapperController.js');

    app.get("/",controller.index);
    app.get("/saved",controller.savedArticle);
    app.get("/scrap",controller.searchArticel);
    app.post("/api/add",controller.addArticel);
    app.post("/api/addComment",controller.addComment);
    app.post("/api/populateNote",controller.allNotes);
    app.post("/api/deleteComment",controller.deleteComment);
    app.post("/api/deleteArticle",controller.deleteArticle);
}