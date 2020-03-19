sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("sap.ui.demo.walkthrough.controller.CategoriesMaster", {
        onInit : function () {
			
        },
        onListItemPress: function(oEvent) {
            var sCategoryId = oEvent.getSource().getBindingContext().getProperty("CategoryID");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("productListDetail",
				{categoryID:sCategoryId});
        }
	});
});