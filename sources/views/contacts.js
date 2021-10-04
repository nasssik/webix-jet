import {JetView} from "webix-jet";

import contacts from "../models/contacts";


export default class ContactView extends JetView {
	config() {
		return {
			cols: [
				{
					rows: [{
						view: "text",
						localId: "listInput",
						placeholder: "Type something here",
						on: {
							onTimedKeyPress: () => {
								let valueInput = this.$$("listInput").getValue().toLowerCase();
								this.$$("contactList").filter(obj => obj.value.toLowerCase().indexOf(valueInput) !== -1 ||
									obj.Job.toLowerCase().indexOf(valueInput) !== -1);
							}
						}
					},
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
					},
					{
						view: "button",
						type: "icon",
						css: "webix_primary",
						icon: "wxi-plus",
						label: "Add contact",
						click: () => {
							this.app.callEvent("showContactForm", ["Add"]);
						}
					}
					]
				},
				{$subview: true}
			]
		};
	}


	init() {
		contacts.waitData.then(() => {
			this.$$("contactList").sync(contacts);
			this.show("/top/contacts/contactInfo").then();
		});

		this.on(this.app, "showContactInfoView", (id) => {
			const list = this.$$("contactList");
			this.show(`/top/contacts?id=${id}/contactInfo`);
			if (!list.isEnabled()) {
				list.enable();
			}
		});
		this.on(this.app, "showContactForm", (mode) => {
			this.show(`contactform?mode=${mode}`);
			if (mode === "Add") {
				this.$$("contactList").disable();
			}
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
