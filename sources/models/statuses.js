const statuses = new webix.DataCollection({
	save: "rest->http://localhost:8096/api/v1/statuses/",
	url: "http://localhost:8096/api/v1/statuses/"
});

export default statuses;
