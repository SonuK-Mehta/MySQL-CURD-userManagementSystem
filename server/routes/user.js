const express = require("express");
const router = express.Router();
// We want to seperate router logic into the userController
const userController = require("../controllers/userController");

// Which funtion we want to call -
// create, find, updates, delte
router.get("/", userController.view); // This view is created inside userController
router.post("/", userController.find);
router.get("/adduser", userController.form);
router.post("/adduser", userController.create);
router.get("/edituser/:id", userController.edit);
router.post("/edituser/:id", userController.update);
router.get("/viewuser/:id", userController.viewall);
router.get("/:id", userController.delete);

// We will partial which mean that we can reuse this form in multiple pages.

module.exports = router;
