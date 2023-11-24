const express = require("express");
const { create, list, remove, show, update } = require("../controllers/userController");

const router = express.Router();

router.post("/", create);
router.get("/", list);
router.post("/:id", update);
router.get("/:id", show);
router.delete("/:id", remove);

module.exports = router;







