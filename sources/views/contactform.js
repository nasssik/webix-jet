import {JetView} from "webix-jet";

import contacts from "../models/contacts";
import statuses from "../models/statuses";

export default class ContactFormView extends JetView {
	config() {
		return {
			rows: [{
				template: "Add contact",
				align: "left",
				css: "nameStyle",
				localId: "name",
				autoheight: true
			},
			{
				view: "form",
				localId: "myform",
				borderless: true,
				elements: [{
					paddingY: 50,
					cols: [{
						width: 500,
						margin: 10,
						paddingX: 60,
						borderless: true,
						rows: [{
							view: "text",
							label: "First Name",
							name: "FirstName",
							css: "inputStyle",
							invalidMessage: "Please write first name"
						},
						{
							view: "text",
							label: "Last Name",
							name: "LastName",
							invalidMessage: "Please write last name"
						},
						{
							view: "datepicker",
							label: "Joing date",
							format: webix.i18n.longDateFormatStr,
							name: "newStartDate",
							invalidMessage: "Please select a date"
						},
						{
							label: "Status",
							name: "StatusID",
							view: "richselect",
							invalidMessage: "Please select status",
							options: {
								body: {
									template: "#Value#",
									data: statuses

								}
							}
						},
						{
							view: "text",
							label: "Job",
							name: "Job",
							invalidMessage: "Please write job"
						},
						{
							view: "text",
							label: "Company",
							name: "Company",
							invalidMessage: "Please write company"
						},
						{
							view: "text",
							label: "Website",
							name: "Website",
							invalidMessage: "Please write website"
						},
						{
							view: "text",
							label: "Address",
							name: "Address",
							invalidMessage: "Please write address"
						}
						]
					},
					{},
					{
						width: 500,
						margin: 10,
						paddingX: 60,
						borderless: true,
						rows: [{
							view: "text",
							label: "Email",
							name: "Email",
							invalidMessage: "Please write email"
						},
						{
							view: "text",
							label: "Skype",
							name: "Skype",
							invalidMessage: "Please write skype"
						},
						{
							view: "text",
							label: "Phone",
							name: "Phone",
							invalidMessage: "Please write phone number"
						},
						{
							view: "datepicker",
							label: "Birthday",
							format: webix.i18n.longDateFormatStr,
							name: "newBirthday",
							invalidMessage: "Please select a date"
						},
						{
							cols: [{
								view: "template",
								localId: "preview",
								template: "<img src='#src#' class='imgForm'></img>",
								height: 100,
								width: 100,
								borderless: true
							},
							{
								rows: [{
									view: "uploader",
									accept: "image/jpeg, image/png",
									value: "Upload file",
									localId: "Photo",
									name: "records",
									autowidth: true,
									autosend: false,
									multiple: false,
									on: {
										onBeforeFileAdd: (upload) => {
											let file = upload.file;
											let reader = new FileReader();
											reader.onload = (event) => {
												this.$$("preview").setValues({
													src: event.target.result
												});
												this.$$("myform").setValues({Photo: event.target.result}, true);
											};
											reader
												.readAsDataURL(
													file
												);
											return false;
										}
									}
								},
								{
									view: "button",
									css: "webix_primary btnStyle",
									label: "Delete",
									autowidth: true,
									click: () => {
										this.$$("preview").setValues({
											src: "https://img.lovepik.com/photo/40002/7350.jpg_wh860.jpg"
										});
									}
								}
								]
							}

							]
						}

						]
					}

					]
				},
				{
					cols: [{},
						{
							view: "button",
							value: "Cancel",
							autowidth: true,
							css: "webix-primary",
							click: () => {
								let id = this.getParam("id", true);
								this.app.callEvent("showContactInfoView", [id]);
							}
						},
						{
							view: "button",
							localId: "SaveAddBTN",
							width: 70,
							css: "webix-primary",
							click: () => {
								let formValue = this.$$("myform")
									.getValues();

								if (this.$$("myform").validate()) {
									contacts.waitSave(() => {
										if (formValue.id) {
											contacts.updateItem(formValue
												.id, formValue);
										}
										else {
											contacts.add(formValue);
										}
									}).then((obj) => {
										this.app.callEvent("showContactInfoView", [obj.id]);
									});
								}
							}
						}
					]
				}
				],
				rules: {
					FirstName: webix.rules.isNotEmpty,
					LastName: webix.rules.isNotEmpty,
					newStartDate: value => value <= new Date(),
					StatusID: webix.rules.isNotEmpty,
					Job: webix.rules.isNotEmpty,
					newBirthday: value => value < new Date() && value !== null
				}
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
			const mode = this.getParam("mode", true);
			if (mode) {
				this.$$("myform").clear();
				this.$$("myform").clearValidation();

				const id = this.getParam("id", true);
				let contactItem = contacts.getItem(id);

				this.$$("name").setHTML(`<H2 class="nameStyle">${mode} contact</H2>`);
				const photoEmptyProfile = "https://img.lovepik.com/photo/40002/7350.jpg_wh860.jpg";
				this.$$("SaveAddBTN").setValue(mode === "Add" ? "Add" : "Save");
				this.$$("preview").setValues(mode === "Add" ? {src: photoEmptyProfile} : {src: contactItem.Photo || photoEmptyProfile});
				if (mode === "Edit") {
					if (contactItem) {
						this.$$("myform").setValues(contactItem);
					}
				}
			}
		});
	}
}
