const activityType = new webix.DataCollection({
	save: "rest->http://localhost:8096/api/v1/activitytypes/",
	url: "http://localhost:8096/api/v1/activitytypes/",
	scheme: {
		$init: (obj) => {
			obj.value = obj.Value;
		}
	}
});

export default activityType;
