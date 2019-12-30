function mover(fbox, tbox) {
	var arrFbox = new Array();
	var arrTbox = new Array();
	var arrLookup = new Array();
	var i;
	for (i = 0; i < tbox.options.length; i++) {
		arrLookup[tbox.options[i].text] = tbox.options[i].value;
		arrTbox[i] = tbox.options[i].text;
	}
	var fLength = 0;
	var tLength = arrTbox.length;
	for(i = 0; i < fbox.options.length; i++) {
		arrLookup[fbox.options[i].text] = fbox.options[i].value;
		if (fbox.options[i].selected && fbox.options[i].value != "") {
			arrTbox[tLength] = fbox.options[i].text;
			tLength++;
		}
		else {
			arrFbox[fLength] = fbox.options[i].text;
			fLength++;
   		}
	}
	arrFbox.sort();
	arrTbox.sort();
	fbox.length = 0;
	tbox.length = 0;
	var c;
	for(c = 0; c < arrFbox.length; c++) {
	var no = new Option();
		no.value = arrLookup[arrFbox[c]];
		no.text = arrFbox[c];
		fbox[c] = no;
	}
	for(c = 0; c < arrTbox.length; c++) {
		var no = new Option();
		no.value = arrLookup[arrTbox[c]];
		no.text = arrTbox[c];
		tbox[c] = no;
	}
}


$(document).ready(function(){
	/*BOTON RELATORIO*/
	$("#relatorio").click(function(){
		const consultores = [];
		const mes_desde = $("#mesDesde").val();
		const anio_desde = $("#anioDesde").val();
		const mes_hasta = $("#mesHasta").val();
		const anio_hasta = $("#anioHasta").val();
		
		$("#consultores2 option").each(function(i,op){
			consultores.push($(op).val());
		});
		$.post( "/relatorio", { consultores, mes_desde, anio_desde, mes_hasta, anio_hasta }, function(data, status){
			renderizarRelatorio(data);
		});
	});

	/*BOTON GRAFICO*/
	$("#grafico").click(function(){
		const consultores = [];
		const mes_desde = $("#mesDesde").val();
		const anio_desde = $("#anioDesde").val();
		const mes_hasta = $("#mesHasta").val();
		const anio_hasta = $("#anioHasta").val();
		
		$("#consultores2 option").each(function(i,op){
			consultores.push($(op).val());
		});
		$.post( "/grafico", { consultores, mes_desde, anio_desde, mes_hasta, anio_hasta }, function(data, status){
			renderizarGrafico(data);
		});
	});

	/*BOTON PIZZA*/
	$("#pizza").click(function(){
		const consultores = [];
		const mes_desde = $("#mesDesde").val();
		const anio_desde = $("#anioDesde").val();
		const mes_hasta = $("#mesHasta").val();
		const anio_hasta = $("#anioHasta").val();
		
		$("#consultores2 option").each(function(i,op){
			consultores.push($(op).val());
		});
		$.post( "/pizza", { consultores, mes_desde, anio_desde, mes_hasta, anio_hasta }, function(data, status){
			renderizarPizza(data);
		});
	});
});

function renderizarRelatorio(data){
	var consultor = data.receita;
	var meses = data.meses;
	var total_receita_liquida = 0, total_custo_fixo = 0, total_comissao = 0, total_lucro = 0;
	var options = { style: 'currency', currency: 'USD' }
	var formatNumber = Intl.NumberFormat('en-US', options);
	$("#resultado-relatorio").removeClass("d-none");
	$("#vacio").addClass("d-none");
	$("#resultado-grafico").addClass("d-none");
	$("#resultado-pizza").addClass("d-none");
	$(".card.card-relatorio").not(".d-none").remove();
	if ( consultor.length > 0 ){
		/*PARA CLONAR LOS CARD CUANDO CONSIGA EL PRIMER CONSULTOR Y EL SIGUIENTE DIFERENTE AL ACTUAL*/
		for ( let i = 0; i < consultor.length; i++ ){
			if ( i == 0 || consultor[i].no_usuario != consultor[i-1].no_usuario ) {
				total_receita_liquida = 0, total_custo_fixo = 0, total_comissao = 0, total_lucro = 0;
				var currentCard = $(".card.card-relatorio.d-none").clone();
				currentCard.removeClass('d-none');
				$('#consultor-header', currentCard).text(consultor[i].no_usuario);
				$('#resultado').append(currentCard);
			}
			var currentFila = $(".filas-template.d-none", currentCard).clone();//Clonando las filas
			//Formateando la data para mostrar
			var periodo = getPeriodo(consultor[i].mes, consultor[i].anio, meses);
			var receita_liquida = formatNumber.format(consultor[i].receita_liquida);
			var custo_fixo = formatNumber.format(consultor[i].custo_fixo);
			var comissao = formatNumber.format(consultor[i].comissao);
			var lucro = formatNumber.format(consultor[i].receita_liquida - (consultor[i].custo_fixo + consultor[i].comissao))
			//Seteando los valores fortmateados en el DOM
			$(".periodo", currentFila).text(periodo);
			$(".receita_liquida", currentFila).text(receita_liquida);
			$(".custo_fixo", currentFila).text(custo_fixo);
			$(".comissao", currentFila).text(comissao);
			$(".lucro", currentFila).text(lucro);
			currentFila.removeClass("d-none");
			$('tbody', currentCard).append(currentFila);//Append
			//Acumulando el total de los valores por consultor
			total_receita_liquida = total_receita_liquida + consultor[i].receita_liquida; 
			total_custo_fixo = total_custo_fixo + consultor[i].custo_fixo; 
			total_comissao = total_comissao + consultor[i].comissao; 
			total_lucro = total_lucro + (consultor[i].receita_liquida - (consultor[i].custo_fixo + consultor[i].comissao)); 
			//Condicion para poner el total por consultor
			if( i == consultor.length - 1 || consultor[i].no_usuario != consultor[i+1].no_usuario ) {
				var currentTotal = $(".filas-total.d-none.text-right", currentCard).clone();
				currentTotal.removeClass('d-none');
				$(".total_receita_liquida", currentTotal).text(formatNumber.format(total_receita_liquida));
				$(".total_custo_fixo", currentTotal).text(formatNumber.format(total_custo_fixo));
				$(".total_comissao", currentTotal).text(formatNumber.format(total_comissao));
				$(".total_lucro", currentTotal).text(formatNumber.format(total_lucro));
				$('tbody', currentCard).append(currentTotal);
			}
		}
	} else {
		$(".card.card-relatorio").addClass('d-none');
		$("#vacio").removeClass("d-none");
	}
}


function renderizarGrafico(data){
	const grafico = data;
	$("#resultado-grafico").removeClass("d-none");
	$("#resultado-relatorio").addClass("d-none");
	$("#resultado-pizza").addClass("d-none");
	var options = {
		animationEnabled: true,
		theme: "light2",
		title: {
			text: "Gráfico"
		},
		axisX: {
			valueFormatString: "MMM",
			interval: 1,
   			intervalType: "month"
		},
		axisY: {
			prefix: "$",
			labelFormatter: addSymbols
			
		},
		toolTip: {
			shared: true
		},
		legend: {
			cursor: "pointer",
			itemclick: toggleDataSeries
		},
		data: [
			
		]
	};
	setData(grafico);
	console.log(options.data);
	$("#graficoContainer").CanvasJSChart(options);

	function addSymbols(e) {
		var suffixes = ["", "K", "M", "B"];
		var order = Math.max(Math.floor(Math.log(e.value) / Math.log(1000)), 0);

		if (order > suffixes.length - 1)
			order = suffixes.length - 1;

		var suffix = suffixes[order];
		return CanvasJS.formatNumber(e.value / Math.pow(1000, order)) + suffix;
	}

	function toggleDataSeries(e) {
		if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
			e.dataSeries.visible = false;
		} else {
			e.dataSeries.visible = true;
		}
		e.chart.render();
	}
	function setData(grafico){
		var totalCosto = 0;
		var promedio = getPromedioGrafico(grafico);
		for ( let i = 0; i < grafico.length; i++ ) {
			if ( i == 0 || grafico[i].co_usuario != grafico[i-1].co_usuario ) {
				options.data.push({
					type: "column",
					name: grafico[i].no_usuario,
					showInLegend: true,
					xValueFormatString: "MMM YYYY",
					yValueFormatString: "$#,##0",
					dataPoints: []
				});
			}
			options.data[options.data.length - 1].dataPoints.push({ x: new Date(grafico[i].anio, grafico[i].mes - 1 ), y: grafico[i].receita_liquida });
		}

		options.data.push({
			type: "line",
			name: "Promedio Costo Fijo",
			showInLegend: true,
			yValueFormatString: "$#,##0",
			dataPoints: []
		});
		const fechaPromedio = getPeriodoPromedio();
		const mes_anio = fechaPromedio;
		for (let i = 0; i < fechaPromedio.length; i++){
			options.data[options.data.length - 1].dataPoints.push({ x: fechaPromedio[i], y: promedio });
		}
	}
}


function renderizarPizza(data){
	const pizza = data;
	console.log(pizza);
	//$("#resultado-grafico").addClass("d-none");
	$("#resultado-pizza").removeClass("d-none");
	$("#resultado-relatorio").addClass("d-none");
	$("#resultado-grafico").addClass("d-none");

	var options = {
		title: {
			text: "Receita Liquida"
		},
		subtitles: [{
			text: "As of November, 2017"
		}],
		animationEnabled: true,
		data: [{
			type: "pie",
			startAngle: 40,
			toolTipContent: "<b>{label}</b>: {y}%",
			showInLegend: "true",
			legendText: "{label}",
			indexLabelFontSize: 16,
			indexLabel: "{label} - {y}%",
			dataPoints: []
		}]
	};
	setData(pizza);
	$("#pizzaContainer").CanvasJSChart(options);

	function setData(pizza){
		var total = pizza.reduce((a, b) => a + b.receita_liquida, 0);
		var acumulador = 0;
		console.log(total);
		for (let i = 0; i < pizza.length; i++){
			acumulador = acumulador + pizza[i].receita_liquida;
			if( i == pizza.length - 1 || pizza[i].co_usuario != pizza[i+1].co_usuario ){
				options.data[0].dataPoints.push({ y: ((100 * acumulador) / total).toFixed(2), label: pizza[i].no_usuario });
				acumulador = 0;
			}
		}
	}
}


function getPromedioPizza (pizza) {
	var receita_liquida_total = 0;
	var costos = pizza.filter((current, i, a) => {
		if( i == 0 || current.co_usuario != a[i-1].co_usuario ) {
			custo_fixo = custo_fixo + current.custo_fixo;
			return true
		} else {
			return false
		}
	});
	return custo_fixo / costos.length;
}

function getPromedioGrafico (grafico) {
	var custo_fixo = 0;
	var costos = grafico.filter((current, i, a) => {
		if( i == 0 || current.co_usuario != a[i-1].co_usuario ) {
			custo_fixo = custo_fixo + current.custo_fixo;
			return true
		} else {
			return false
		}
	});
	return custo_fixo / costos.length;
}

function getPeriodoPromedio() {
	const fechas = [];
	const md = $("#mesDesde").val();
	const ad = $("#anioDesde").val();
	const mh = $("#mesHasta").val();
	const ah = $("#anioHasta").val();
	counter = parseInt(md);
	for(var i=parseInt(ad);i<=parseInt(ah);i++)
	{
	  for(var j=counter;j<=12;j++){
	    if(j>mh && i==ah){
	       continue;
	    }
	    fechas.push(new Date(i,j-1));
	  }
	  counter = 1;
	}
	return fechas;
}

function getPeriodo (mes, anio, objetoMes) {
	var { nombre } = objetoMes.find(m => m.mes == mes);
	return nombre + " de " + anio;
}
