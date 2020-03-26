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
        changeLanguageDE: function() {
            var language = window.navigator.userLanguage || window.navigator.language;
            var sCurrentLocale = sap.ui.getCore().getConfiguration().getLanguage();

            if( sCurrentLocale == language)
                sap.ui.getCore().getConfiguration().setLanguage("de");
            else
                sap.ui.getCore().getConfiguration().setLanguage(language);
            
        }
	});
});