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

module.exports = utility;