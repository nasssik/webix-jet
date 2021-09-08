import {JetView} from "webix-jet";

import contacts from "../models/contacts";
import statuses from "../models/statuses";

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
							click: () => {}
						},
						{
							view: "button",
							css: "webix_primary btnStyle",
							type: "icon",
							icon: "wxi-pencil",
							label: "Edit",
							autowidth: true,
							click: () => {}
						}
					]
				},
				{
					view: "template",
					autoheight: true,
					template: this.getInfo,
					borderless: true,
					css: "contact-info",
					localId: "infoContact"
				},
				{}
			]
		};
	}


	urlChange() {
		webix.promise.all([
			contacts.waitData,
			statuses.waitData
		]).then(() => {
			const id = this.getParam("id");
			if (id && contacts.exists(id)) {
				const values = webix.copy(contacts.getItem(id));
				values.statusStr = statuses.getItem(values.StatusID).Value;
				this.$$("name").setValues(values);
				this.$$("infoContact").setValues(values);
			}
		});
	}

	getInfo(obj) {
		return `
		<div class="tempale">
		<div class="сolumn">
		<img class=img src="${obj.Photo || "https://image.flaticon.com/icons/png/512/149/149071.png"}"/>
		<span class="status">${obj.statusStr || ""}</span>
		</div>
		<div class="сolumn">
		<div class="line"><span class="mdi mdi-email item"></span>${obj.Email || ""}</span></div>
		<div class="line"><span class="mdi mdi-skype item></span><span class="item">${obj.Skype || ""}</span></div>
		<div class="line"><span class="mdi mdi-tag item"></span><span class="item">${obj.Job || ""}</span></div>
		<div class="line"><span class="mdi mdi-briefcase item"></span><span class="item">${obj.Company || ""}</span></div>
		</div>
		<div class="сolumn">
		<div class="line"><span class="webix_icon mdi mdi-calendar item"></span><span class="item">${obj.Birthday || ""}</span></div>
		<div class="line"><span class="mdi mdi-map-marker item></span><span class="item">${obj.Address || ""}</span></div>
		</div>
		</div>`;
	}
}
