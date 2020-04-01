sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"../model/formatter",
], function(Controller, History, formatter) {
	"use strict";

	return Controller.extend("sap.ui.demo.walkthrough.controller.ProductDetails", {
		formatter: formatter,

		onInit : function () {
			this.getOwnerComponent().getRouter().getRoute("productDetails").attachPatternMatched(this._onRouteMatched, this);
		},
		_onRouteMatched: function(oEvent) {
			var productId = oEvent.getParameter("arguments").productID;
			this.getView().bindElement("/Products(" + productId + ")");
		},
		onNavBack : function () {
			var sPreviousHash = History.getInstance().getPreviousHash();

			//The history contains a previous entry
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				// There is no history!
				// replace the current hash with order id 0 (will not add an history entry)
				this.getOwnerComponent().getRouter()
					.navTo("ProductListDetail");
			}
		}

	});

});