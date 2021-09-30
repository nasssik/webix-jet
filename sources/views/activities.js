import {JetView} from "webix-jet";

import activity from "../models/activity";
import activityType from "../models/activityType";
import contacts from "../models/contacts";
import ActivityForm from "./activityform";


export default class ActivityView extends JetView {
	config() {
		return {

			rows: [{
				view: "toolbar",
				cols: [
					{},
					{
						view: "button",
						type: "icon",
						css: "webix_primary",
						icon: "wxi-plus",
						width: 200,
						label: "Add activity",
						click: () => {
							this.form.showForm({}, "Add");
						}

					}
				]
			},
			{
				view: "datatable",
				localId: "contactsData",
				hover: "hoverLine",
				autoConfig: true,
				scrollX: false,
				select: true,
				columns: [{
					id: "State",
					header: "",
					checkValue: "Close",
					uncheckValue: "Open",
					template: "{common.checkbox()}",
					editor: "checkbox"

				},
				{
					id: "TypeID",
					editor: "select",
					header: ["Activity type", {
						content: "selectFilter"
					}],
					options: activityType,
					fillspace: true,
					sort: "string"
				},
				{
					id: "DueNewDate",
					format: webix.i18n.longDateFormatStr,
					header: ["Due date", {
						content: "dateRangeFilter"
					}],
					fillspace: true,
					sort: "date"
				},
				{
					id: "Details",
					header: ["Details", {
						content: "textFilter"
					}],
					fillspace: true,
					sort: "string"
				},
				{
					id: "ContactID",
					editor: "select",
					header: ["Contact", {
						content: "selectFilter"
					}],
					options: contacts,
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
							text: "Are you sure?",
							callback: (result) => {
								if (result) {
									activity.remove(id);
								}
							}
						});
						return false;
					},
					editBtn: (el, id) => {
						this.form.showForm(activity.getItem(id), "Edit");
					}
				}
			}
			]
		};
	}

	init() {
		this.form = this.ui(ActivityForm);
		webix.promise.all([
			activity.waitData,
			contacts.waitData,
			activityType.waitData
		]).then(
			() => {
				this.$$("contactsData").sync(activity);
				activity.data.filter();
			}
		);
	}
}
