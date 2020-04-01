sap.ui.define([
	"sap/ui/core/format/NumberFormat",
	"sap/base/i18n/ResourceBundle"
], function (NumberFormat, ResourceBundle) {
	"use strict";

	var formatter = {

		/**
		 * Sums up the price for all products in the cart
		 * @param {object} oCartEntries current cart entries
		 * @return {string} string with the total value
		 */
		totalPrice: function (oCartEntries) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle(),
				fTotalPrice = 0;

			Object.keys(oCartEntries).forEach(function (ProductID) {
				var oProduct = oCartEntries[ProductID];
				fTotalPrice += parseFloat(oProduct.UnitPrice) * oProduct.Quantity;
			});
			return oBundle.getText("cartTotalPrice", formatter.price(fTotalPrice));
		},
		/**
		 * Formats the price
		 * @param {string} sValue model price value
		 * @return {string} formatted price
		 */
		price: function (sValue) {
			var numberFormat = NumberFormat.getFloatInstance({
				maxFractionDigits: 2,
				minFractionDigits: 2,
				groupingEnabled: true,
				groupingSeparator: ".",
				decimalSeparator: ","
			});
			return numberFormat.format(sValue);
		}
	};
	return formatter;
});