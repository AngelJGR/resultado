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
	$("#resultado-container").addClass("d-none");
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
			//$('#resultado').text(data);
		});
	});
});

function renderizarRelatorio(data){
	var datos = data.receita;
	$("#resultado-container").removeClass("d-none");
	console.log(datos)
	if(datos.length > 0){
		for ( consultor of datos ){
			var currentFila = $(".filas-template.d-none").clone();
			$(".periodo", currentFila).text(consultor.anio + "-" + consultor.mes);
			$(".receita_liquida", currentFila).text(consultor.receita_liquida);
			$(".custo_fixo", currentFila).text(consultor.custo_fixo);
			$(".comissao", currentFila).text(consultor.comissao);
			$(".lucro", currentFila).text(obtenerLucro(consultor.receita_liquida, consultor.custo_fixo, consultor.comissao));
			currentFila.removeClass('d-none');
			$('tbody').append(currentFila);
		}
	} else {
		//Añadir mensaje en el HTML Pendiente
		//$("#resultado").html("<h1>No se encontraron datos</h1>");
	}
}

function obtenerLucro(receita_liquida, custo_fixo, comissao) {
	return receita_liquida - (custo_fixo + comissao);
}




