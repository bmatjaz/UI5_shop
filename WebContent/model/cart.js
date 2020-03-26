sap.ui.define([
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function (
	MessageBox,
	MessageToast) {
	"use strict";

	return {

		/**
		 * Checks for the status of the product that is added to the cart.
		 * If the product is not available, a message dialog will open.
		 * @public
		 * @param {Object} oBundle i18n bundle
		 * @param {Object} oProduct Product that is added to the cart
		 * @param {Object} oCartModel Cart model
		 */
		addToCart: function (oBundle, oProductToBeAdded, oCartModel) {
			// Items to be added from the welcome view have it's content inside product object
			if (oProductToBeAdded.Product !== undefined) {
				oProductToBeAdded = oProductToBeAdded.Product;
			}
			// find existing entry for product
			var oCollectionEntries = Object.assign({}, oCartModel.getData()["cartEntries"]);
			var oCartEntry =  oCollectionEntries[oProductToBeAdded.ProductID];

			if (oCartEntry === undefined) {
				// create new entry
				oCartEntry = Object.assign({}, oProductToBeAdded);
				oCartEntry.Quantity = 1;
				oCollectionEntries[oProductToBeAdded.ProductID] = oCartEntry;
			} else {
				// update existing entry
				oCartEntry.Quantity += 1;
			}
			//update the cart model
			oCartModel.setProperty("/cartEntries", Object.assign({}, oCollectionEntries));
			oCartModel.refresh(true);
			MessageToast.show(oBundle.getText("productMsgAddedToCart", [oProductToBeAdded.ProductName] ));
		}
	};
});