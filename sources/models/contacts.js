const contacts = new webix.DataCollection({
	save: "rest->http://localhost:8096/api/v1/contacts/",
	url: "http://localhost:8096/api/v1/contacts/",
	scheme: {
		$init: (obj) => {
			obj.value = `${obj.FirstName}  ${obj.LastName}`;
		}
	}
});

export default contacts;
