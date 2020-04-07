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
        },
        goToShoppingCart: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("shoppingCart");
        },
        changeLanguage: function(oEvent) {
            var oValidatedComboBox = oEvent.getSource(),
            sSelectedKey = oValidatedComboBox.getSelectedKey(),
            language = window.navigator.userLanguage || window.navigator.language;

            if(sSelectedKey=="default") {
                sap.ui.getCore().getConfiguration().setLanguage(language);
            }
            else {
                sap.ui.getCore().getConfiguration().setLanguage(sSelectedKey);
            }
        }
	});
});