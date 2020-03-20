sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], function (Controller, MessageBox) {
    "use strict";
    
    var sCartModelName = "cartProducts";
	var sCartEntries = "cartEntries";

	return Controller.extend("sap.ui.demo.walkthrough.controller.ShoppingCart", {
		onInit : function () {

        },
        handleDelete: function(oEvent) {
			var oBindingContext = oEvent.getParameter("listItem").getBindingContext(sCartModelName);
			var sEntryId = oBindingContext.getObject().ProductID;

			// show confirmation dialog
			MessageBox.show("Item will be removed from cart", {
				title: "Removing item",
				actions: [
					MessageBox.Action.DELETE,
					MessageBox.Action.CANCEL
				],
				onClose: function (oAction) {
					if (oAction !== MessageBox.Action.DELETE) {
						return;
					}
					var oCartModel = oBindingContext.getModel();
					var oCollectionEntries = Object.assign({}, oCartModel.getData()[sCartEntries]);

					delete oCollectionEntries[sEntryId];

					// update model
					oCartModel.setProperty("/" + sCartEntries, Object.assign({}, oCollectionEntries));
				}
			});
		}
	});
});