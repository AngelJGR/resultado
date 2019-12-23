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
			renderizarRelatorio(data)
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
			//$('#resultado').text(data);
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
	$(".card.card-relatorio").not(".d-none").remove();
	if ( consultor.length > 0 ){
		/*PARA CLONAR LOS CARD CUANDO CONSIGA EL PRIMER CONSULTOR Y EL SIGUIENTE DIFERENTE AL ACTUAL*/
		for ( let i = 0; i < consultor.length; i++ ){
			if ( i == 0 ) {
				var currentCard = $(".card.card-relatorio.d-none").clone();
				currentCard.removeClass('d-none');
				$('#consultor-header', currentCard).text(consultor[i].no_usuario);
				$('#resultado').append(currentCard);
			} else if ( consultor[i].no_usuario != consultor[i-1].no_usuario ) {
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
			if ( i == consultor.length - 1) {
				var currentTotal = $(".filas-total.d-none.text-right", currentCard).clone();
				currentTotal.removeClass('d-none');
				$(".total_receita_liquida", currentTotal).text(formatNumber.format(total_receita_liquida));
				$(".total_custo_fixo", currentTotal).text(formatNumber.format(total_custo_fixo));
				$(".total_comissao", currentTotal).text(formatNumber.format(total_comissao));
				$(".total_lucro", currentTotal).text(formatNumber.format(total_lucro));
				$('tbody', currentCard).append(currentTotal);
			}
			else if( consultor[i].no_usuario != consultor[i+1].no_usuario ) {
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
	var options = {
		animationEnabled: true,
		theme: "light2",
		title: {
			text: "Monthly Sales Data"
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
			{
				type: "line",
				name: "Promedio Costo Fijo",
				showInLegend: true,
				yValueFormatString: "$#,##0",
				dataPoints: [
				]
			}
		]
	};
	setData(grafico);
	console.log(options.data);
	$("#chartContainer").CanvasJSChart(options);

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
		var promedio = getPromedio(grafico);
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
			if ( i == 0 || (grafico[i].mes != grafico[i-1].mes) ) {
				options.data[0].dataPoints.push({ x: new Date(grafico[i].anio, grafico[i].mes - 1 ), y: promedio });
			}
		}
	}
}


function getPromedio (grafico) {
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

	//console.log(custo_total / unique.length);
}

function getPeriodo (mes, anio, objetoMes) {
	var { nombre } = objetoMes.find(m => m.mes == mes);
	return nombre + " de " + anio;
}


