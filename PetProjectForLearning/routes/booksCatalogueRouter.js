const express = require('express')
const router = express.Router();
const booksCatalogueController = require('../controllers/booksCatalogueController')
const {authorizationWithRoles} = require('../middleware/middleware')

router.route('/')
    .get(booksCatalogueController.getAllBooks)
    .post(authorizationWithRoles("Editor", "Admin"), booksCatalogueController.addBook)
    .delete(authorizationWithRoles("Admin"), booksCatalogueController.deleteBook);

module.exports = router;