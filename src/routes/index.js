const express = require("express");
const router = express.Router();

const pool = require("../database");
const { meses } = require("../lib/util");

router.get("/", async (req, res) => {
	res.render("./");
});

router.post("/relatorio", async (req, res) => {
	const { consultores, mes_desde, anio_desde, mes_hasta, anio_hasta } = req.body;
	const receita = await pool.query("SELECT b.co_usuario, c.no_usuario, YEAR( a.data_emissao ) AS anio, MONTH( a.data_emissao ) as mes, \
	ROUND( SUM( a.valor - (( a.total_imp_inc / 100 ) * a.valor) ), 2 ) AS receita_liquida, \
	d.brut_salario AS custo_fixo, \
	ROUND(SUM( ( a.valor - ( ( a.total_imp_inc / 100 ) * a.valor) ) * ( a.comissao_cn / 100 ) ), 2 ) AS comissao \
	FROM cao_fatura AS a \
	INNER JOIN cao_os AS b ON a.co_os = b.co_os \
	INNER JOIN cao_usuario AS c ON b.co_usuario = c.co_usuario \
	INNER JOIN cao_salario AS d ON c.co_usuario = d.co_usuario \
	WHERE MONTH( a.data_emissao ) between ? AND ? \
	AND YEAR( a.data_emissao ) between ? AND ? \
	AND b.co_usuario IN (?) \
	GROUP BY c.co_usuario, mes, anio; ", [mes_desde, mes_hasta, anio_desde, anio_hasta, consultores]);

	res.json({ receita, meses });
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

