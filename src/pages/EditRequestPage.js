import React from 'react';
import PropTypes from 'prop-types';
import lodashGet from 'lodash/get';
import {withOnyx} from 'react-native-onyx';
import CONST from '../CONST';
import ScreenWrapper from '../components/ScreenWrapper';
import HeaderWithBackButton from '../components/HeaderWithBackButton';
import Navigation from '../libs/Navigation/Navigation';
import compose from '../libs/compose';
import withLocalize, {withLocalizePropTypes} from '../components/withLocalize';
import MoneyRequestAmountPage from './iou/steps/MoneyRequestAmountPage';
import * as CurrencyUtils from '../libs/CurrencyUtils';
import ONYXKEYS from '../ONYXKEYS';
import * as ReportActionsUtils from '../libs/ReportActionsUtils';
import RequestDescription from '../components/RequestDescription';
import RequestCreated from '../components/RequestCreated';
import DateUtils from '../libs/DateUtils';
import reportPropTypes from './reportPropTypes';
import * as ReportUtils from '../libs/ReportUtils';

const propTypes = {
    ...withLocalizePropTypes,

    /** Route from navigation */
    route: PropTypes.shape({
        /** Params from the route */
        params: PropTypes.shape({
            /** Which field we are editing */
            field: PropTypes.string,

            /** This is going to be the reportID for the "transaction thread" */
            threadReportID: PropTypes.string,
        }),
    }).isRequired,

    /** The report object for the thread report */
    report: reportPropTypes,
};

const defaultProps = {
    report: {},
};

/**
 * @param {string} fieldName
 * @returns {string}
 */
function getTranslationForField(fieldName) {
    switch (fieldName) {
        case CONST.EDIT_REQUEST_FIELD.AMOUNT: {
            return 'iou.amount';
        }
        case CONST.EDIT_REQUEST_FIELD.DESCRIPTION: {
            return 'common.description';
        }
        case CONST.EDIT_REQUEST_FIELD.DATE: {
            return 'common.date';
        }
        default: {
            throw new Error('Invalid fieldName for this view');
        }
    }
}

function EditRequestPage(props) {
    const parentReportAction = ReportActionsUtils.getParentReportAction(props.report);
    const moneyRequestReportAction = ReportUtils.getMoneyRequestAction(parentReportAction);
    const transactionAmount = moneyRequestReportAction.amount;
    const transactionCurrency = moneyRequestReportAction.currency;
    const transactionDescription = moneyRequestReportAction.comment;
    const created = parentReportAction.created;
    const threadReportID = lodashGet(props, ['route', 'params', 'threadReportID'], '');
    const field = lodashGet(props, ['route', 'params', 'field'], '');

    function updateTransactionWithChanges(changes) {
        // Update the transaction...
        // eslint-disable-next-line no-console
        console.log({changes});

        // Note: The "modal" we are dismissing is the MoneyRequestAmountPage
        Navigation.dismissModal();
    }

    if (field === CONST.EDIT_REQUEST_FIELD.DESCRIPTION) {
        return (
            <RequestDescription
                onBackButtonPress={() => Navigation.goBack()}
                validate={() => ({})}
                submit={({comment}) => updateTransactionWithChanges({comment})}
                headerTitle={props.translate('common.description')}
                formID={ONYXKEYS.FORMS.MONEY_REQUEST_DESCRIPTION_FORM}
                textInputID="comment"
                textInputLabel={props.translate('moneyRequestConfirmationList.whatsItFor')}
                textInputDefaultValue={transactionDescription}
            />
        );
    }

    return (
        <ScreenWrapper includeSafeAreaPaddingBottom={field === CONST.EDIT_REQUEST_FIELD.AMOUNT}>
            <HeaderWithBackButton
                title={props.translate(getTranslationForField(field))}
                shouldShowBackButton
                onBackButtonPress={() => Navigation.dismissModal()}
                onCloseButtonPress={() => Navigation.dismissModal()}
            />
            {field === CONST.EDIT_REQUEST_FIELD.AMOUNT && (
                <MoneyRequestAmountPage
                    onStepComplete={(value, selectedCurrencyCode) => {
                        updateTransactionWithChanges({modifiedCurrency: selectedCurrencyCode, modifiedAmount: value * 100});
                    }}
                    selectedCurrencyCode={transactionCurrency}
                    reportID={threadReportID}
                    hasMultipleParticipants={false}
                    selectedAmount={CurrencyUtils.convertToWholeUnit(transactionCurrency, transactionAmount)}
                    navigation={props.navigation}
                    route={props.route}
                    iouType={CONST.IOU.MONEY_REQUEST_TYPE.REQUEST}
                    buttonText={props.translate('common.save')}
                />
            )}
            {field === CONST.EDIT_REQUEST_FIELD.DATE && (
                <RequestCreated
                    defaultValue={DateUtils.getDateStringFromISOTimestamp(created)}
                    route={props.route}
                    submit={(modifiedCreated) => {
                        updateTransactionWithChanges({modifiedCreated});
                    }}
                />
            )}
        </ScreenWrapper>
    );
}

EditRequestPage.displayName = 'EditRequestPage';
EditRequestPage.propTypes = propTypes;
EditRequestPage.defaultProps = defaultProps;
export default compose(
    withLocalize,
    withOnyx({
        report: {
            key: ({route}) => `${ONYXKEYS.COLLECTION.REPORT}${route.params.threadReportID}`,
        },
    }),
)(EditRequestPage);
