import React, {useState} from 'react';
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
import * as IOU from '../libs/actions/IOU';

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
    const [amount, setAmount] = useState();
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
                                const amountInSmallestCurrencyUnits = CurrencyUtils.convertToSmallestUnit(selectedCurrencyCode, Number.parseFloat(value));
                                IOU.setIOUSelectedCurrency(selectedCurrencyCode);
                                setAmount(amountInSmallestCurrencyUnits);
                                Navigation.dismissModal();
                            }}
                            reportID={threadReportID}
                            hasMultipleParticipants={false}
                            selectedAmount={CurrencyUtils.convertToWholeUnit(props.iou.selectedCurrencyCode, amount)}
                            navigation={props.navigation}
                            route={props.route}
                            iouType={props.iouType}
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
        iou: {
            key: ONYXKEYS.IOU,
        },
    },
))(EditRequestPage);
