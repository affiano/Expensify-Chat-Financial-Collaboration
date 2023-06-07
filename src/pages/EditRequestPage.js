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
import * as ReportUtils from '../libs/ReportUtils';
import * as Transaction from '../libs/actions/Transaction';
import RequestDescription from '../components/RequestDescription';
import RequestCreated from '../components/RequestCreated';

const propTypes = {
    ...withLocalizePropTypes,
    route: PropTypes.shape({
        params: PropTypes.shape({
            field: PropTypes.string,
        }),
    }).isRequired,
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
    const moneyRequestAction = ReportUtils.getMoneyRequestAction(parentReportAction);
    const transactionID = lodashGet(parentReportAction, 'originalMessage.IOUTransactionID');
    const iouReportID = lodashGet(parentReportAction, 'originalMessage.IOUReportID');
    const transactionAmount = moneyRequestAction.amount;
    const currency = moneyRequestAction.currency;
    const description = moneyRequestAction.comment;

    // If we have a modifiedCreated on the transaction then we will use it otherwise we will have just the created
    const transaction = lodashGet(props.reportTransactions, transactionID, {});
    const created = transaction.created || transaction.modifiedCreated;
    const threadReportID = lodashGet(props, ['route', 'params', 'threadReportID'], '');
    const field = lodashGet(props, ['route', 'params', 'field'], '');

    function updateTransactionWithChanges(changes) {
        Transaction.updateTransaction(changes, transactionID, iouReportID, parentReportAction.reportActionID);

        // Note: The "modal" we are dismissing is the MoneyRequestAmountPage
        Navigation.dismissModal();
    }

    return (
        <ScreenWrapper includeSafeAreaPaddingBottom={false}>
            {({safeAreaPaddingBottomStyle}) => (
                <>
                    <HeaderWithBackButton
                        title={props.translate(getTranslationForField(field))}
                        shouldShowBackButton
                        onBackButtonPress={() => Navigation.dismissModal()}
                        onCloseButtonPress={() => Navigation.dismissModal()}
                    />
                    {field === CONST.EDIT_REQUEST_FIELD.AMOUNT && (
                        <MoneyRequestAmountPage
                            onStepComplete={(value, selectedCurrencyCode) => {
                                updateTransactionWithChanges({currency: selectedCurrencyCode, amount: value * 100});
                            }}
                            selectedCurrencyCode={currency}
                            reportID={threadReportID}
                            hasMultipleParticipants={false}
                            selectedAmount={CurrencyUtils.convertToWholeUnit(currency, transactionAmount)}
                            navigation={props.navigation}
                            route={props.route}
                            iouType={CONST.IOU.MONEY_REQUEST_TYPE.REQUEST}
                            buttonText={props.translate('common.save')}
                        />
                    )}
                    {field === CONST.EDIT_REQUEST_FIELD.DESCRIPTION && (
                        <RequestDescription
                            onBackButtonPress={() => Navigation.goBack()}
                            validate={() => ({})}
                            submit={({moneyRequestComment}) => updateTransactionWithChanges({comment: moneyRequestComment})}
                            headerTitle={props.translate('common.description')}
                            formID={ONYXKEYS.FORMS.MONEY_REQUEST_DESCRIPTION_FORM}
                            textInputID="moneyRequestComment"
                            textInputLabel={props.translate('moneyRequestConfirmationList.whatsItFor')}
                            textInputDefaultValue={description}
                        />
                    )}
                    {field === CONST.EDIT_REQUEST_FIELD.DATE && (
                        <RequestCreated
                            defaultValue={created}
                            route={props.route}
                            submit={(modifiedCreated) => {
                                updateTransactionWithChanges({modifiedCreated});
                            }}
                        />
                    )}
                </>
            )}
        </ScreenWrapper>
    );
}

EditRequestPage.displayName = 'EditRequestPage';
EditRequestPage.propTypes = propTypes;
export default compose(
    withLocalize,
    withOnyx({
        report: {
            key: ({route}) => `${ONYXKEYS.COLLECTION.REPORT}${route.params.threadReportID}`,
        },
        iou: {
            key: ONYXKEYS.IOU,
        },
    }),
    // Note: The order of this connection is important because getting the transaction key depends on the report prop
    withOnyx({
        reportTransactions: {
            key: (props) => {
                const parentReportAction = ReportActionsUtils.getParentReportAction(props.report);
                const iouReportID = lodashGet(parentReportAction, 'originalMessage.IOUReportID');
                return `${ONYXKEYS.COLLECTION.TRANSACTION}${iouReportID}`;
            },
        },
    }),
)(EditRequestPage);
