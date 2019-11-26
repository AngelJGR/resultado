const express = require("express");
const router = express.Router();

const pool = require("../database");

router.get("/", async (req, res) => {
	const consultores = await pool.query("SELECT a.co_usuario, a.no_usuario FROM cao_usuario AS a \
	INNER JOIN permissao_sistema AS b ON a.co_usuario = b.co_usuario \
	WHERE b.co_sistema = 1 AND b.in_ativo = 'S' AND b.co_tipo_usuario IN(0,1,2)");
	res.render("./", { consultores: consultores });
});

module.exports = router;