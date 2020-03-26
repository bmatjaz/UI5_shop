sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function (Controller, JSONModel, MessageBox) {
	"use strict";

	return Controller.extend("sap.ui.demo.walkthrough.controller.Overview", {
        onInit : function () {
			this._oHistory = {
				prevPaymentSelect: null,
				prevDiffDeliverySelect: null
			};
			var oModel = new JSONModel(
				{
					SelectedPayment: "Credit Card",
					CashOnDelivery: {
						FirstName: "",
						LastName: "",
						PhoneNumber: "",
						Email: ""
					},
					InvoiceAddress: {
						Address: "",
						City: "",
						ZipCode: "",
						Country: "",
						Note: ""
					},
					DeliveryAddress: {
						Address: "",
						Country: "",
						City: "",
						ZipCode: "",
						Note: ""
					},
					CreditCard: {
						Name: "",
						CardNumber: "",
						SecurityCode: "",
						Expire: ""
					}
				}
			);
			this.getView().setModel(oModel);
		},
		onPressMasterBack: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("shoppingCart");
		},
		goToDeliveryAddress: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("addressinput");
		},
		/**
		 * Shows next WizardStep according to user selection
		 */
		goToPaymentStep: function () {
			var selectedKey = this.getView().getModel().getProperty("/SelectedPayment");
			var oElement = this.getView().byId("paymentTypeStep");
			switch (selectedKey) {
				case "Bank Transfer":
					oElement.setNextStep(this.getView().byId("bankAccountStep"));
					break;
				case "Cash on Delivery":
					oElement.setNextStep(this.getView().byId("cashOnDeliveryStep"));
					break;
				case "Credit Card":
				default:
					oElement.setNextStep(this.getView().byId("creditCardStep"));
					break;
			}
		},
		/**
		 * Shows warning message if user changes previously selected payment method
		 */
		setPaymentMethod: function () {
			this._setDiscardableProperty({
				message: "U MAD BRO",
				discardStep: this.getView().byId("paymentTypeStep"),
				modelPath: "/SelectedPayment",
				historyPath: "prevPaymentSelect"
			});
		},
		/**
		 * Checks the corresponding step after activation to decide whether the user can proceed or needs
		 * to correct the input
		 */
		onCheckStepActivation: function(oEvent) {
			var sWizardStepId = oEvent.getSource().getId();
			switch (sWizardStepId) {
			case this.createId("creditCardStep"):
				this.checkCreditCardStep();
				break;
			case this.createId("cashOnDeliveryStep"):
				this.checkCashOnDeliveryStep();
				break;
			case this.createId("invoiceStep"):
				this.checkInvoiceStep();
				break;
			case this.createId("deliveryAddressStep"):
				this.checkDeliveryAddressStep();
				break;
			}
		},
		/**
		 * Called from  Wizard on <code>complete</code>
		 * Navigates to the summary page in case there are no errors
		 */
		checkCompleted: function () {
				this.byId("wizardNavContainer").to(this.getView().byId("summaryPage"));
		},
		/**
		 * Validates the credit card step initially and after each input
		 */
		checkCreditCardStep: function () {
			this._checkStep("creditCardStep", ["creditCardHolderName"]);
		},
		/**
		 * Validates the cash on delivery step initially and after each input
		 */
		checkCashOnDeliveryStep: function () {
			this._checkStep("cashOnDeliveryStep", []);
		},
		/**
		 * Validates the invoice step initially and after each input
		*/
		checkInvoiceStep: function () {
			this._checkStep("invoiceStep", ["invoiceAddressAddress", "invoiceAddressCity", "invoiceAddressZip", "invoiceAddressCountry"]);
		},
		/**
		 * Checks if one or more of the inputs are empty
		 * @param {array} aInputIds - Input ids to be checked
		 * @returns {boolean}
		 * @private
		 */
		_checkInputFields : function (aInputIds) {
			var oView = this.getView();
			
			return aInputIds.some(function (sInputId) {
				var oInput = oView.byId(sInputId);
				var oBinding = oInput.getBinding("value");
				try {
					oBinding.getType().validateValue(oInput.getValue());
				} catch (oException) {
					return true;
				}
				return false;
			});
		},
		/**
		 * Hides button to proceed to next WizardStep if validation conditions are not fulfilled
		 * @param {string} sStepName - the ID of the step to be checked
		 * @param {array} aInputIds - Input IDs to be checked
		 * @private
		 */
		_checkStep: function (sStepName, aInputIds) {
			var oWizard = this.getView().byId("shoppingCartWizard"),
				oStep = this.getView().byId(sStepName),
				bEmptyInputs = this._checkInputFields(aInputIds),
				bValidationError = !!sap.ui.getCore().getMessageManager().getMessageModel().getData().length;

			if (!bValidationError && !bEmptyInputs) {
				oWizard.validateStep(oStep);
			} else {
				oWizard.invalidateStep(oStep);
			}
		},
		/**
		 * Called from both <code>setPaymentMethod</code> and <code>setDifferentDeliveryAddress</code> functions.
		 * Shows warning message if user changes previously selected choice
		 * @private
		 * @param {Object} oParams Object containing message text, model path and WizardSteps
		 */
		_setDiscardableProperty: function (oParams) {
			var oWizard = this.getView().byId("shoppingCartWizard");
			if (oWizard.getProgressStep() !== oParams.discardStep) {
				MessageBox.warning(oParams.message, {
					actions: [MessageBox.Action.YES,
						MessageBox.Action.NO],
					onClose: function (oAction) {
						if (oAction === MessageBox.Action.YES) {
							oWizard.discardProgress(oParams.discardStep);
							this._oHistory[oParams.historyPath] = this.getView().getModel().getProperty(oParams.modelPath);
						} else {
							this.getModel().setProperty(oParams.modelPath, this._oHistory[oParams.historyPath]);
						}
					}.bind(this)
				});
			} else {
				this._oHistory[oParams.historyPath] = this.getView().getModel().getProperty(oParams.modelPath);
			}
		},
		/**
		 * Called from <code>ordersummary</code>
		 * shows warning message and submits order if confirmed
		 */
		handleWizardSubmit: function () {
			var sText = "Are you shure?";
			this._handleSubmitOrCancel(sText, "confirm", "ordercompleted");
		},
		/**
		 * Called from <code>ordersummary</code>
		 * shows warning message and cancels order if confirmed
		 */
		handleWizardCancel: function () {
			var sText = "You shure you want to cancle";
			this._handleSubmitOrCancel(sText, "warning", "categoriesMaster");
		},
		_handleSubmitOrCancel: function (sMessage, sMessageBoxType, sRoute) {
			MessageBox[sMessageBoxType](sMessage, {
				actions: [MessageBox.Action.YES,
					MessageBox.Action.NO],
				onClose: function (oAction) {
					if (oAction === MessageBox.Action.YES) {
						// resets Wizard
						var oWizard = this.getView().byId("shoppingCartWizard");
						oWizard.discardProgress(oWizard.getSteps()[0]);

						var oModel = this.getView().getModel();
						var oCartModel = this.getOwnerComponent().getModel("cartProducts");
						
						var oModelData = oModel.getData();
						oModelData.SelectedPayment = "Credit Card";
						oModelData.CashOnDelivery = {};
						oModelData.InvoiceAddress = {};
						oModelData.DeliveryAddress = {};
						oModelData.CreditCard = {};
						oModel.setData(oModelData);
						//all relevant cart properties are set back to default. Content is deleted.
						var oCartModelData = oCartModel.getData();
						oCartModelData.cartEntries = {};
						oCartModelData.totalPrice = 0;
						oCartModel.setData(oCartModelData);
						this.getOwnerComponent().getRouter().navTo("categoriesMaster");
						location.reload();
					}
				}.bind(this)
			});
		},

	});
});