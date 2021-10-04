import {JetView} from "webix-jet";

import contacts from "../models/contacts";
import statuses from "../models/statuses";
import activity from "../models/activity";
import records from "../models/records";
import TabbarActivityFiles from "./tabbaractivityfiles";


export default class ContactInfoView extends JetView {
	config() {
		return {
			rows: [
				{
					cols: [
						{
							view: "template",
							autoheight: true,
							template: "#FirstName# #LastName#",
							css: "nameStyle",
							localId: "name"
						},
						{
							view: "button",
							type: "icon",
							css: "webix_primary btnStyle",
							icon: "wxi-trash",
							label: "Delete",
							autowidth: true,
							click: () => {
								let id = this.getParam("id", true);
								webix.confirm({
									text: "Do you still want to continue?",
									callback: (result) => {
										if (result) {
											const filesActivity = activity.find(
												obj => obj.ContactID.toString() === id.toString()
											);
											filesActivity.forEach((act) => {
												activity.remove(act.id);
											});
											const filesRecords = records.find(
												obj => obj.ContactID.toString() === id.toString()
											);
											filesRecords.forEach((act) => {
												records.remove(act.id);
											});

											contacts.remove(id);
											this.show("/top/contacts/contactInfo");
										}
									}
								});
								return false;
							}
						},
						{
							view: "button",
							css: "webix_primary btnStyle",
							type: "icon",
							icon: "wxi-pencil",
							label: "Edit",
							autowidth: true,
							click: () => {
								this.app.callEvent("showContactForm", ["Edit"]);
							}
						}
					]
				},
				{
					view: "template",
					template: this.getInfo,
					borderless: true,
					css: "contact-info",
					localId: "infoContact"
				},
				TabbarActivityFiles
			]
		};
	}


	urlChange() {
		webix.promise.all([
			contacts.waitData,
			statuses.waitData
		]).then(() => {
			const id = this.getParam("id", true);
			if (id && contacts.exists(id)) {
				const values = webix.copy(contacts.getItem(id));
				values.statusStr = statuses.getItem(values.StatusID).Value;
				this.$$("name").setValues(values);
				this.$$("infoContact").setValues(values);
			}
		});
	}

	
	getInfo(obj) {
		const format = webix.i18n.longDateFormatStr;

		return `
		<div class="tempale">
		<div class="сolumn">
		<img class=img src="${obj.Photo || "https://img.lovepik.com/photo/40002/7350.jpg_wh860.jpg"}"/>
		<span class="status">${obj.statusStr || ""}</span>
		</div>
		<div class="сolumn">
		<div class="line"><span class="mdi mdi-email item"></span>${obj.Email || ""}</span></div>
		<div class="line"><span class="mdi mdi-skype item></span><span class="item">${obj.Skype || ""}</span></div>
		<div class="line"><span class="mdi mdi-tag item"></span><span class="item">${obj.Job || ""}</span></div>
		<div class="line"><span class="mdi mdi-briefcase item"></span><span class="item">${obj.Company || ""}</span></div>
		</div>
		<div class="сolumn">
		<div class="line"><span class="webix_icon mdi mdi-calendar item"></span><span class="item">${format(obj.newBirthday) || ""}</span></div>
		<div class="line"><span class="mdi mdi-map-marker item></span><span class="item">${obj.Address || ""}</span></div>
		</div>
		</div>`;
	}
}
