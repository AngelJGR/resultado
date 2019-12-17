const express = require("express");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const path = require("path");

const pool = require("./database");
const util = require("./lib/util");

const app = express();

//Settings
app.set("port", process.env.PORT || 2000);
app.set("views", path.join(__dirname, "views"));
app.engine("hbs", exphbs({
	defaultLayout: "main",
	layoutsDir: path.join(app.get("views"), "layouts"),
	partialsDir: path.join(app.get("views"), "partials"),
	extname: ".hbs",
	helpers: require("./lib/handlebars.js")

}));

app.set("view engine", ".hbs");


//MiddleWares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Routes
app.use(require("./routes"));

//Global Variables
app.use(async (req, res, next) => {
	app.locals.consultores = await pool.query("SELECT a.co_usuario, a.no_usuario FROM cao_usuario AS a \
	INNER JOIN permissao_sistema AS b ON a.co_usuario = b.co_usuario \
	WHERE b.co_sistema = 1 AND b.in_ativo = 'S' AND b.co_tipo_usuario IN(0,1,2)");
	rango_fechas = await pool.query("SELECT MIN(data_emissao) AS fecha_minima, MAX(data_emissao) AS fecha_maxima FROM cao_fatura;");
	app.locals.meses = util.meses;
	app.locals.anios = util.getAnio(rango_fechas).length > 1 ? util.getAnio(rango_fechas) : util.getAnio(rango_fechas)[0];
	next();
});

//Public
app.use(express.static(path.join(__dirname, "public")));

//Starting the server
app.listen(app.get("port"), () => {
	console.log("Puerto: " + app.get("port"));
});