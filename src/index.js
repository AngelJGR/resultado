const express = require("express");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const path = require("path");


const app = express();

//Settings
app.set("port", process.env.PORT || 2000);
app.set("views", path.join(__dirname, "views"));
app.engine("hbs", exphbs({
	defaultLayout: "main",
	layoutsDir: path.join(app.get("views"), "layouts"),
	partialsDir: path.join(app.get("views"), "partials"),
	extname: ".hbs",
	helpers: ("./lib/handlebars")

}));

app.set("view engine", ".hbs");


//MiddleWares
app.use(morgan("dev"));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//Routes
app.use(require("./routes"));

//Global Variables

//Public
app.use(express.static(path.join(__dirname, "public")));

//Starting the server
app.listen(app.get("port"), () => {
	console.log("Puerto: " + app.get("port"));
});