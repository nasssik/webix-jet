const strFormatting = webix.Date.strToDate("%d-%m-%Y  %H:%i");
const dateFormatting = webix.Date.dateToStr("%Y-%m-%d");
const formatTime = webix.Date.dateToStr("%H:%i");

const activity = new webix.DataCollection({
	save: "rest->http://localhost:8096/api/v1/activities/",
	url: "http://localhost:8096/api/v1/activities/",
	scheme: {
		$init: (obj) => {
			obj.DueNewDate = obj.DueNewDate || strFormatting(obj.DueDate);
			obj.DueNewTime = obj.DueNewTime || obj.DueNewDate;
		},
		$save: (obj) => {
			obj.DueDate = `${dateFormatting(obj.DueNewDate)} ${formatTime(obj.DueNewTime)}`;
		}
	}
});

export default activity;
