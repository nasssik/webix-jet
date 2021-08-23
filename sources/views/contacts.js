/* eslint-disable linebreak-style */
import {JetView} from "webix-jet";

import contacts from "../models/contacts";
import ContactInfoView from "./contactInfo";


export default class ContactView extends JetView {
	config() {
		return {
			cols: [
				{
					rows: [
						{
							view: "list",
							localId: "contactList",
							width: 300,
							css: "webix_shadow_medium",
							select: true,
							template: this.getUser,
							type: {
								height: 60
							},
							on: {
								onAfterSelect: (id) => {
									this.setParam("id", id, true);
								}
							}
						}
					]
				},
				ContactInfoView
			]
		};
	}


	init() {
		contacts.waitData.then(() => {
			this.$$("contactList").sync(contacts);
		});
	}

	urlChange() {
		contacts.waitData.then(() => {
			const list = this.$$("contactList");
			let id = this.getParam("id");
			if (!id || !contacts.exists(id)) {
				id = contacts.getFirstId();
			}
			if (id && id !== list.getSelectedId()) {
				list.select(id);
			}
		});
	}

	getUser(obj) {
		return `<div class='contactItem'>
					<image class="littleImg" src="${obj.Photo || "https://image.flaticon.com/icons/png/512/149/149071.png"}" /> 
					<div class="contactInfo">
						<span class="contactName">${obj.FirstName} ${obj.LastName}</span>
						<span class="contactJob">${obj.Job || ""}</span>
					</div>
					</div>
					`;
	}
}
