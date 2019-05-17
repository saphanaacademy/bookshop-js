/*eslint no-console: 0, no-unused-vars: 0*/
"use strict";

var cds = require("@sap/cds");
var xsenv = require("@sap/xsenv");
var xssec = require("@sap/xssec");
var express = require("express");
var passport = require("passport");

var app = express();

app.use(express.json());

passport.use("JWT", new xssec.JWTStrategy(xsenv.getServices({
	uaa: {
		tag: "xsuaa"
	}
}).uaa));
app.use(passport.initialize());
app.use(
	passport.authenticate("JWT", {
		session: false
	})
);

var options = {
	kind: "hana",
	logLevel: "error"
};
cds.connect(options);
cds.serve("gen/csn.json", {
		crashOnError: false
	})
	.at("/catalog")
	.with(require("./cat-service.js"))
	.in(app)
	.catch((err) => {
		console.log(err);
		process.exit(1);
	});

// subscribe/onboard a subscriber tenant
app.put("/callback/v1.0/tenants/*", function (req, res) {
	console.log('Subscribe:', req.body.subscribedSubdomain, req.body.subscribedTenantId);
	let tenantAppURL = "https:\/\/" + req.body.subscribedSubdomain + "-trial-dev-bookshop-js-app" + ".cfapps.eu10.hana.ondemand.com";
	res.status(200).send(tenantAppURL);
});

// unsubscribe/offboard a subscriber tenant
app.delete("/callback/v1.0/tenants/*", function (req, res) {
	console.log('Unsubscribe:', req.body.subscribedSubdomain, req.body.subscribedTenantId);
	let cdsql = DELETE.from('MY_BOOKSHOP_BOOKS').where({
		tenantID: req.body.subscribedTenantId
	});
	cds.run(cdsql).then(r => console.log("Unsubscribe: Rows deleted:", r)).catch((err) => {
		console.log(err);
	});
	res.status(200).send("");
});


var server = require("http").createServer();
var port = process.env.PORT || 3000;

server.on("request", app);

server.listen(port, function () {
	console.info("srv: " + server.address().port);
});
