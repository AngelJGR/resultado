const helpers = {}

//Comparar dos valores
helpers.if_eq = function (a, b, opts) {
	if(a == b){
		return opts.fn(this);
	} else{
		return opts.inverse(this);
	}
};

module.exports = helpers;