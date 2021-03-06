/*
TODO: input formatting: decimals, thousand separators
  */

import React from "react";
import { Menu, Label } from "semantic-ui-react";
import Button from "../../../components/augmint-ui/button";
import store from "modules/store";
import { EthSubmissionErrorPanel, EthSubmissionSuccessPanel, ConnectionStatus } from "components/MsgPanels";
import { reduxForm, Field, SubmissionError, formValueSelector } from "redux-form";
import { Form, Validations, Normalizations } from "components/BaseComponents";
import { placeOrder, PLACE_ORDER_SUCCESS, TOKEN_BUY, TOKEN_SELL } from "modules/reducers/orders";
import { connect } from "react-redux";
import { Pblock } from "components/PageLayout";
import { PriceToolTip } from "./ExchangeToolTips";

const ETH_DECIMALS = 5;
const TOKEN_DECIMALS = 2;

class PlaceOrderForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { result: null, orderDirection: TOKEN_BUY, lastChangedAmountField: "" };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onOrderDirectionChange = this.onOrderDirectionChange.bind(this);
        this.onTokenAmountChange = this.onTokenAmountChange.bind(this);
        this.onEthAmountChange = this.onEthAmountChange.bind(this);
        this.onPriceChange = this.onPriceChange.bind(this);
    }

    componentDidUpdate(prevProps) {
        // recaluclate amounts displayed when published ETH/EUR rates changed
        if (prevProps.rates && prevProps.rates.info.ethFiatRate !== this.props.rates.info.ethFiatRate) {
            this.reCalcAmounts(this.props.price);
        }
    }

    onOrderDirectionChange(e, { name, index }) {
        this.setState({ orderDirection: index });
    }

    onTokenAmountChange(e) {
        console.debug("onTokenAmountChange ", e);
        let tokenAmount, price;
        try {
            this.setState({ lastChangedAmountField: "tokenAmount" });
            tokenAmount = parseFloat(e.target.value);
            price = this.parsePrice(this.props.price);
            const ethValue = tokenAmount / this.props.rates.info.ethFiatRate * price;
            this.props.change("ethAmount", Number(ethValue.toFixed(ETH_DECIMALS)));
        } catch (error) {
            this.props.change("ethAmount", "");
        }
    }

    onEthAmountChange(e) {
        let price, ethAmount;
        try {
            this.setState({ lastChangedAmountField: "ethAmount" });
            ethAmount = parseFloat(e.target.value);
            price = this.parsePrice(this.props.price);
            const tokenValue = ethAmount * this.props.rates.info.ethFiatRate * price;

            this.props.change("tokenAmount", Number(tokenValue.toFixed(TOKEN_DECIMALS)));
        } catch (error) {
            this.props.change("tokenAmount", "");
        }
    }

    onPriceChange(e) {
        this.reCalcAmounts(e.target.value);
    }

    reCalcAmounts(_price) {
        const price = this.parsePrice(_price);
        if (this.state.lastChangedAmountField === "ethAmount") {
            const ethAmount = parseFloat(this.props.ethAmount);
            if (!isNaN(ethAmount) && isFinite(ethAmount)) {
                const tokenValue = ethAmount * this.props.rates.info.ethFiatRate * price;
                this.props.change("tokenAmount", Number(tokenValue.toFixed(TOKEN_DECIMALS)));
            } else {
                //  ethAmount is not entered yet
                this.props.change("tokenAmount", "");
            }
        } else {
            const tokenAmount = parseFloat(this.props.tokenAmount);
            if (!isNaN(tokenAmount) && isFinite(tokenAmount)) {
                const ethValue = tokenAmount / this.props.rates.info.ethFiatRate * price;
                this.props.change("ethAmount", Number(ethValue.toFixed(ETH_DECIMALS)));
            } else {
                // tokenAmount is not entered yet
                this.props.change("tokenAmount", "");
            }
        }
    }

    async handleSubmit(values) {
        let amount, price;
        const orderDirection = this.state.orderDirection;

        try {
            price = this.parsePrice(values.price);
            console.debug(values.price, price);
            if (orderDirection === TOKEN_BUY) {
                amount = parseFloat(values.ethAmount);
            } else {
                amount = parseFloat(values.tokenAmount);
            }
        } catch (error) {
            throw new SubmissionError({
                _error: {
                    title: "Invalid amount",
                    details: error
                }
            });
        }

        const res = await store.dispatch(placeOrder(orderDirection, amount, price));

        if (res.type !== PLACE_ORDER_SUCCESS) {
            throw new SubmissionError({
                _error: res.error
            });
        } else {
            this.setState({
                result: res.result
            });
            return;
        }
    }

    parsePrice(price) {
        return Math.round(price * 100) / 10000;
    }

    render() {
        const {
            header: mainHeader,
            rates,
            exchange,
            error,
            handleSubmit,
            pristine,
            submitting,
            submitSucceeded,
            clearSubmitErrors,
            reset
        } = this.props;
        const { orderDirection } = this.state;

        const ethAmountValidations = [Validations.required, Validations.ethAmount];
        if (orderDirection === TOKEN_BUY) {
            ethAmountValidations.push(Validations.ethUserBalance);
        }

        const tokenAmountValidations = [Validations.required, Validations.tokenAmount, Validations.minOrderTokenAmount];
        if (orderDirection === TOKEN_SELL) {
            tokenAmountValidations.push(Validations.userTokenBalance);
        }

        const header = (
            <div>
                {mainHeader}
                <Menu size="massive" tabular>
                    <Menu.Item
                        active={orderDirection === TOKEN_BUY}
                        index={TOKEN_BUY}
                        onClick={this.onOrderDirectionChange}
                        data-testid="buyMenuLink"
                    >
                        Buy A-EUR
                    </Menu.Item>
                    <Menu.Item
                        active={orderDirection === TOKEN_SELL}
                        index={TOKEN_SELL}
                        onClick={this.onOrderDirectionChange}
                        data-testid="sellMenuLink"
                    >
                        Sell A-EUR
                    </Menu.Item>
                </Menu>
            </div>
        );

        return (
            <Pblock loading={exchange.isLoading || !rates.isLoaded || (pristine && rates.isLoading)} header={header}>
                <ConnectionStatus contract={this.props.exchange} />

                {submitSucceeded && (
                    <EthSubmissionSuccessPanel
                        header="Order submitted"
                        result={this.state.result}
                        onDismiss={() => reset()}
                        data-test-orderid={this.state.result.orderId}
                    />
                )}

                {!submitSucceeded &&
                    this.props.rates.isLoaded && (
                        <Form error={error ? true : false} onSubmit={handleSubmit(this.handleSubmit)}>
                            <EthSubmissionErrorPanel
                                error={error}
                                header="Place Order failed"
                                onDismiss={() => clearSubmitErrors()}
                            />

                            <Field
                                name="tokenAmount"
                                label={`${this.state.lastChangedAmountField === "ethAmount" ? "= " : "  "} ${
                                    orderDirection === TOKEN_BUY ? "A-EUR amount: " : "Sell amount: "
                                } `}
                                component={Form.Field}
                                as={Form.Input}
                                type="number"
                                disabled={submitting || !exchange.isLoaded}
                                onChange={this.onTokenAmountChange}
                                validate={tokenAmountValidations}
                                normalize={Normalizations.twoDecimals}
                                labelPosition="right"
                            >
                                <input data-testid="tokenAmountInput" />
                                <Label>A-EUR</Label>
                            </Field>

                            <Field
                                name="ethAmount"
                                component={Form.Field}
                                as={Form.Input}
                                type="number"
                                label={`${this.state.lastChangedAmountField === "tokenAmount" ? "= " : "  "} ${
                                    orderDirection === TOKEN_BUY ? "ETH amount to sell: " : "ETH amount: "
                                }`}
                                disabled={submitting || !exchange.isLoaded}
                                onChange={this.onEthAmountChange}
                                validate={ethAmountValidations}
                                normalize={Normalizations.fiveDecimals}
                                labelPosition="right"
                            >
                                <input data-testid="ethAmountInput" />
                                <Label>ETH</Label>
                            </Field>

                            <Field
                                name="price"
                                component={Form.Field}
                                as={Form.Input}
                                type="number"
                                label="Price (% of of published rate): "
                                disabled={submitting || !exchange.isLoaded}
                                onChange={this.onPriceChange}
                                validate={Validations.price}
                                normalize={Normalizations.twoDecimals}
                                labelPosition="right"
                            >
                                <Label>
                                    <PriceToolTip />
                                </Label>
                                <input data-testid="priceInput" />
                                <Label>%</Label>
                            </Field>

                            <Button
                                size="big"
                                loading={submitting}
                                disabled={pristine}
                                data-testid="submitButton"
                                type="submit"
                            >
                                {submitting && "Submitting..."}
                                {!submitting &&
                                    (orderDirection === TOKEN_BUY
                                        ? "Submit buy A-EUR order"
                                        : "Submit sell A-EUR order")}
                            </Button>
                        </Form>
                    )}
            </Pblock>
        );
    }
}

const selector = formValueSelector("PlaceOrderForm");
PlaceOrderForm = connect(state => {
    const { ethAmount, tokenAmount, price } = selector(state, "ethAmount", "tokenAmount", "price");
    return { ethAmount, tokenAmount, price }; // to get amounts for orderHelpText in render
})(PlaceOrderForm);

PlaceOrderForm = reduxForm({
    form: "PlaceOrderForm",
    shouldValidate: params => {
        // workaround for issue that validations are not triggered when changing orderDirection in menu.
        // TODO: this is hack, not perfect, eg. user clicks back and forth b/w sell&buy then balance check
        //       is not always happening before submission attempt.
        //       also lot of unnecessary validation call
        if (params.props.error) {
            return false; // needed otherwise submission error is not shown
        }
        return true;
    }
})(PlaceOrderForm);

function mapStateToProps(state, ownProps) {
    return { initialValues: { price: 100 } };
}

PlaceOrderForm = connect(mapStateToProps)(PlaceOrderForm);

export default PlaceOrderForm;
