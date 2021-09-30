import {JetView} from "webix-jet";

import activity from "../models/activity";
import activityType from "../models/activityType";
import contacts from "../models/contacts";
import records from "../models/records";
import ActivityForm from "./activityform";


export default class TabbarActivityFiles extends JetView {
	config() {
		return {
			rows: [{
				borderless: true,
				view: "tabbar",
				localId: "tabbar",
				multiview: true,
				options: [
					{
						value: "Activities",
						id: "activitiesView"
					},
					{
						value: "Files",
						id: "files"
					}
				]
			},
			{
				cells: [
					{
						id: "activitiesView",
						rows: [{
							id: "activities",
							view: "datatable",
							autoConfig: true,
							scrollX: false,
							select: true,
							columns: [{
								id: "checkbox",
								header: "",
								template: "{common.checkbox()}",
								width: 50
							},
							{
								id: "TypeID",
								editor: "select",
								header: [{
									content: "selectFilter"
								}],
								options: activityType,
								width: 300,
								sort: "string"
							},
							{
								id: "DueNewDate",
								format: webix.i18n.longDateFormatStr,
								header: [{
									content: "dateRangeFilter"
								}],
								width: 300,
								sort: "date"
							},
							{
								id: "Details",
								header: [{
									content: "textFilter"
								}],
								fillspace: true,
								sort: "string"
							},
							{
								template: "<span class='webix_icon wxi-pencil act editBtn'></span>",
								width: 40
							},
							{
								template: "<span class='webix_icon wxi-trash act removeBtn'></span>",
								width: 40
							}
							],
							onClick: {
								removeBtn: (el, id) => {
									webix.confirm({
										text: "Do you still want to continue?",
										callback: (result) => {
											if (result) {
												activity.remove(id);
											}
										}
									});
									return false;
								},
								editBtn: (el, id) => {
									this.form.showForm(activity.getItem(id),
										"Edit", "true");
								}
							}
						},
						{
							view: "button",
							type: "icon",
							css: "webix_primary",
							icon: "wxi-plus",
							label: "Add activity",
							click: () => {
								let id = this.getParam("id", true);
								this.form.showForm({ContactID: id}, "Add", "true");
							}

						}]
					},
					{
						view: "form",
						id: "files",
						rows: [
							{
								localId: "mydatatable",
								view: "datatable",
								autoConfig: true,
								scrollX: false,
								select: true,
								columns: [
									{
										id: "name",
										header: "Name",
										width: 300,
										sort: "string",
										fillspace: true
									},
									{
										id: "lastModifiedDate",
										format: webix.i18n.longDateFormatStr,
										header: "Change date",
										width: 300,
										sort: "date"
									},
									{
										id: "sizetext",
										header: "Size",
										width: 300,
										sort: "string"
									},
									{
										template: "<span class='webix_icon wxi-trash act removeBtn'></span>",
										width: 40
									}
								],
								onClick: {
									removeBtn: (el, id) => {
										webix.confirm({
											text: "Do you still want to continue?",
											callback: (result) => {
												if (result) {
													records.remove(id);
												}
											}
										});
										return false;
									}

								}
							},
							{
								view: "uploader",
								label: "Upload file",
								name: "records",
								type: "icon",
								icon: "wxi-download",
								on: {
									onBeforeFileAdd(unload) {
										const id = this.$scope.getParam("id", true);
										records.add({
											name: unload.name,
											sizetext: unload.sizetext,
											lastModifiedDate: unload.file.lastModifiedDate,
											contactID: id
										});
										return false;
									}
								}
							}
						]
					}

				]
			}
			]
		};
	}

	init() {
		this.form = this.ui(ActivityForm);
	}

	urlChange() {
		records.waitData.then(() => {
			let id = this.getParam("id", true);
			this.$$("mydatatable").sync(records);
			if (id && contacts.exists(id)) {
				records.data.filter(data => data.contactID.toString() === id.toString());
			}
		});

		webix.promise.all([
			activity.waitData,
			contacts.waitData,
			activityType.waitData
		]).then(() => {
			let id = this.getParam("id", true);
			if (id && contacts.exists(id)) {
				webix.$$("activities").sync(activity);
				activity.data.filter(obj => obj.ContactID.toString() === id.toString());
			}
		});
	}
}
