const utility = {}

//Meses del año
utility.meses = new Array(
	{ mes: "01", nombre: "enero" },
	{ mes: "02", nombre: "febrero" },
	{ mes: "03", nombre: "marzo" },
	{ mes: "04", nombre: "abril" },
	{ mes: "05", nombre: "mayo" },
	{ mes: "06", nombre: "junio" },
	{ mes: "07", nombre: "julio" },
	{ mes: "08", nombre: "agosto" },
	{ mes: "09", nombre: "septiembre" },
	{ mes: "10", nombre: "octubre" },
	{ mes: "11", nombre: "noviembre" },
	{ mes: "12", nombre: "diciembre" }
);

//Obtener los años entre el año minimo y el maximo
utility.getAnio = (rangoFechas) => {
	var anioMin = rangoFechas[0].fecha_minima.toISOString().substr(0,4)
	const anioMax = rangoFechas[0].fecha_maxima.toISOString().substr(0,4)
	const diferencia = anioMax - anioMin;
	var n;
	const anios = new Array();
	if (diferencia > 0){
		for (var i = 0; i <= diferencia; i++) {
			anios.push({ anio: anioMin });
			anioMin = (parseInt(anioMin)+1);
		}
	} else {
		anios.push(anioMin);
	}
	return anios;
}

utility.consulta = "SELECT b.co_usuario, c.no_usuario, YEAR( a.data_emissao ) AS anio, MONTH( a.data_emissao ) as mes, \
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
	GROUP BY c.co_usuario, mes, anio; ";

module.exports = utility;