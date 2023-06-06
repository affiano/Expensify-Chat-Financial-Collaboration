import React from 'react';
import PropTypes from 'prop-types';
import lodashGet from 'lodash/get';
import {withOnyx} from 'react-native-onyx';
import CONST from '../CONST';
import ScreenWrapper from '../components/ScreenWrapper';
import HeaderWithCloseButton from '../components/HeaderWithCloseButton';
import Navigation from '../libs/Navigation/Navigation';
import compose from '../libs/compose';
import withLocalize, {withLocalizePropTypes} from '../components/withLocalize';
import MoneyRequestAmountPage from './iou/steps/MoneyRequestAmountPage';
import * as CurrencyUtils from '../libs/CurrencyUtils';
import ONYXKEYS from '../ONYXKEYS';
import * as ReportActionsUtils from '../libs/ReportActionsUtils';
import * as ReportUtils from '../libs/ReportUtils';
import * as Transaction from '../libs/actions/Transaction';

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
    switch(fieldName) {
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
    const transactionAmount = moneyRequestAction.amount;
    const currency = moneyRequestAction.currency;
    const description = moneyRequestAction.comment;

    const threadReportID = lodashGet(props, ['route', 'params', 'threadReportID'], '');
    const field = lodashGet(props, ['route', 'params', 'field'], '');
    return (
        <ScreenWrapper includeSafeAreaPaddingBottom={false}>
            {({safeAreaPaddingBottomStyle}) => (
                <>
                    <HeaderWithCloseButton
                        title={props.translate(getTranslationForField(field))}
                        shouldShowBackButton
                        onBackButtonPress={() => Navigation.dismissModal()}
                        onCloseButtonPress={() => Navigation.dismissModal()}
                    />
                    {field === CONST.EDIT_REQUEST_FIELD.AMOUNT && (
                        <MoneyRequestAmountPage
                            onStepComplete={(value, selectedCurrencyCode) => {
                                Transaction.updateTransaction({currency: selectedCurrencyCode, amount: -(value * 100)});

                                // Note: The "modal" we are dismissing is the MoneyRequestAmountPage
                                Navigation.dismissModal();
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
                </>
            )}
        </ScreenWrapper>
    )
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
    },
))(EditRequestPage);
