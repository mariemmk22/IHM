const express = require("express");
const router = express.Router();

const rendezVousController = require("../controllers/rendezVousController");
const { verifyToken } = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.get(
	"/client/:clientId",
	verifyToken,
	roleMiddleware("client"),
	rendezVousController.getByClient,
);

router.post(
	"/",
	verifyToken,
	roleMiddleware("client"),
	rendezVousController.createRendezVous,
);

router.get(
	"/prestataire/:prestataireId",
	verifyToken,
	roleMiddleware("prestataire"),
	rendezVousController.getByPrestataire,
);

router.patch(
	"/:id/status",
	verifyToken,
	roleMiddleware("prestataire"),
	rendezVousController.updateStatus,
);

module.exports = router;
