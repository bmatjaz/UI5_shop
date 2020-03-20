sap.ui.define([
	"sap/ui/core/UIComponent",
	"./model/LocalStorageModel",
	"./model/models"
], function (UIComponent, LocalStorageModel, model) {
	"use strict";

	return UIComponent.extend("sap.ui.demo.walkthrough.Component", {

		metadata : {
			manifest: "json"
		},

		init : function () {
			//create and set cart model
			var oCartModel = new LocalStorageModel("SHOPPING_CART", {
				cartEntries: {},
				savedForLaterEntries: {}
			});
			this.setModel(oCartModel, "cartProducts");


			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);

			// initialize the router
			this.getRouter().initialize();

			this.getRouter().attachTitleChanged(function(oEvent){
				// set the browser page title based on selected order/product
				document.title = oEvent.getParameter("title");
			});

		}
	});

}, true);