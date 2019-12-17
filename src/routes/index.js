const express = require("express");
const router = express.Router();

const { getSelect } = require("../lib/util");
const pool = require("../database");

router.get("/", async (req, res) => {
	res.render("./");
});

router.post("/relatorio", async (req, res) => {
	if(req.url.indexOf("") > 0) { return; }
	const op = 1;
	const { consultores, fecha_desde, fecha_hasta } = req.body;
	const receita = await pool.query("SELECT b.co_usuario, a.co_fatura, a.co_cliente, a.co_sistema, a.co_os, a.total, a.valor, a.data_emissao, a.total_imp_inc \
	FROM cao_fatura AS a \
	INNER JOIN cao_os AS b ON a.co_os = b.co_os \
	INNER JOIN cao_usuario AS c ON b.co_usuario = c.co_usuario \
	WHERE SUBSTR(a.data_emissao, 1, 7) between ? AND ? \
	AND b.co_usuario IN (?);", [fecha_desde, fecha_hasta, consultores]);
	res.json({ receita });
});

router.get("/grafico", async (req, res) => {
	const op = 2;
	res.render("./", { op: op });
});

router.get("/pizza", async (req, res) => {
	const op = 3;
	res.render("./", { op: op });
});

module.exports = router;

