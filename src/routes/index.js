const express = require("express");
const router = express.Router();

const util = require("../lib/util");
const pool = require("../database");

router.get("/", async (req, res) => {
	const consultores = await pool.query("SELECT a.co_usuario, a.no_usuario FROM cao_usuario AS a \
	INNER JOIN permissao_sistema AS b ON a.co_usuario = b.co_usuario \
	WHERE b.co_sistema = 1 AND b.in_ativo = 'S' AND b.co_tipo_usuario IN(0,1,2)");
	const rango_fechas = await pool.query("SELECT MIN(data_emissao) AS fecha_minima, MAX(data_emissao) AS fecha_maxima FROM cao_fatura;");
	const anios = util.getAnio(rango_fechas).length > 1 ? util.getAnio(rango_fechas) : util.getAnio(rango_fechas)[0];
	res.render("./", { consultores: consultores, meses: util.meses, anios: anios});
});


router.get("/relatorio", (req, res) => {
	res.render("./relatorio");
});

module.exports = router;