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
   $("#relatorio").click(function(){
		var consultores = [];
		var fecha_desde = $("#anioDesde").val()+"-"+$("#mesDesde").val();
		var fecha_hasta = $("#anioHasta").val()+"-"+$("#mesHasta").val();
		$("#consultores2 option").each(function(i,op){
			consultores.push($(op).val());
		});
		$.post( "/relatorio", { consultores, fecha_desde ,fecha_hasta }, function(data, status){
			console.log(data);
			$('#resultado').text(data);
		});
	});
});



