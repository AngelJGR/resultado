const express = require("express");
const router = express.Router();

const pool = require("../database");
const { meses, consulta } = require("../lib/util");

router.get("/", async (req, res) => {
	res.render("./");
});

router.post("/relatorio", async (req, res) => {
	const { consultores, mes_desde, anio_desde, mes_hasta, anio_hasta } = req.body;
	const receita = await pool.query(consulta, [mes_desde, mes_hasta, anio_desde, anio_hasta, consultores]);
	res.json({ receita, meses });
});


router.post("/grafico", async (req, res) => {
	const { consultores, mes_desde, anio_desde, mes_hasta, anio_hasta } = req.body;
	const grafico = await pool.query(consulta, [mes_desde, mes_hasta, anio_desde, anio_hasta, consultores]);
	res.json( grafico );
});

router.post("/pizza", async (req, res) => {
	const { consultores, mes_desde, anio_desde, mes_hasta, anio_hasta } = req.body;
	const grafico = await pool.query(consulta, [mes_desde, mes_hasta, anio_desde, anio_hasta, consultores]);
	res.json( grafico );
});

module.exports = router;

