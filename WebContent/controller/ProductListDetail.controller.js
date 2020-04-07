sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../model/cart"
], function (Controller, cart) {
	"use strict";

	return Controller.extend("sap.ui.demo.walkthrough.controller.ProductListDetail", {
		onInit : function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("productListDetail").attachMatched(this._onRouteMatched, this);
			//this.oModel = this.getOwnerComponent().getModel();
		},
		_onRouteMatched: function(oEvent) {
			this.categoryId = oEvent.getParameter("arguments").categoryID;
			var _oTable = this.getView().byId("productTable");
			var oTemplate = _oTable.getBindingInfo("items").template;
			var oBindingInfo = {
				path: "/Categories(" + this.categoryId + ")/Products",
				template: oTemplate,
			};
			_oTable.bindAggregation("items", oBindingInfo);
		},
		getProductDetails: function(oEvent) {
			var sProductId = oEvent.getSource().getBindingContext().getProperty("ProductID");
			this.oRouter.navTo("productDetails",
					{categoryID:this.categoryId, productID: sProductId });
		},
		addItemToCart: function(oEvent) {
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			var oProduct = oEvent.getSource().getBindingContext().getObject();
			var oCartModel = this.getView().getModel("cartProducts");			
			cart.addToCart(oResourceBundle, oProduct, oCartModel);
		},
		toCart: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("shoppingCart");
		},
		toHome: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("categoriesMaster");
		}
	});

});