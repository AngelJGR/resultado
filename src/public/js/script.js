




// function mover(valor){
// 	if (valor === 1) {
// 		var array = document.getElementById("consultores");
// 		var arrayDos = document.getElementById("consultores2");
// 		var seleccionar = array.selectedIndex;
// 		console.log(seleccionar);
// 		var seleccionarDos = arrayDos.options.length;
// 		if (seleccionar !=1) {
// 			var mover = array.options[seleccionar];
// 			arrayDos.options[seleccionarDos] = new Option(mover.text, mover.value);
// 			array.options[seleccionar] = null;
// 		}
// 	}else if(valor === 2){
// 		var array = document.getElementById("consultores2");
// 		var arrayDos = document.getElementById("consultores");
// 		var seleccionar = array.selectedIndex;
// 		var seleccionarDos = arrayDos.options.length;
// 		if (seleccionar !=1) {
// 			var mover = array.options[seleccionar];
// 			arrayDos.options[seleccionarDos] = new Option(mover.text, mover.value);
// 			array.options[seleccionar] = null;
// 		}
// 	}
// }


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