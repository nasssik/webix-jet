const strForatting = webix.Date.strToDate("%d-%m-%Y %H:%i");
const dateForatting = webix.Date.strToDate("%Y-%m-%d %H:%i");
const formatTime = webix.Date.dateToStr("%H:%i");

const activity = new webix.DataCollection({
	save: "rest->http://localhost:8096/api/v1/activities/",
	url: "http://localhost:8096/api/v1/activities/",
	scheme: {
		$init: (obj) => {
			obj.DueNewDate = obj.DueNewDate || strForatting(obj.DueDate);
			obj.DueNewTime = obj.DueNewTime || obj.DueNewDate;
		},
		$save: (obj) => {
			obj.DueDate = `${dateForatting(obj.DueNewDate)} ${formatTime(obj.DueNewTime)}`;
		}
	}
});

export default activity;
