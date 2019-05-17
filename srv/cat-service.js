module.exports = function (entities) {

	this.on('CREATE', 'Books', req => {
		req.data.tenantID = req._.req.authInfo.identityZone;
	})

	this.on('DELETE', 'Books', req => {
		req.query.DELETE.where.push("and", {
			"ref": ["tenantID"]
		}, "=", {
			"val": req._.req.authInfo.identityZone
		});
	})

	this.on('UPDATE', 'Books', req => {
		req.data.tenantID = req._.req.authInfo.identityZone;
		req.query.UPDATE.where.push("and", {
			"ref": ["tenantID"]
		}, "=", {
			"val": req._.req.authInfo.identityZone
		});
	})

	this.on('READ', 'Books', req => {
		if (!req.query.SELECT.where) {
			req.query.SELECT.where = [{
				"ref": ["tenantID"]
			}, "=", {
				"val": req._.req.authInfo.identityZone
			}];
		} else {
			req.query.SELECT.where.push("and", {
				"ref": ["tenantID"]
			}, "=", {
				"val": req._.req.authInfo.identityZone
			});
		}
	})

}