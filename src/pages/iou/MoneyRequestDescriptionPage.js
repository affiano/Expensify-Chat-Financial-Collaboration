import React from 'react';
import {withOnyx} from 'react-native-onyx';
import PropTypes from 'prop-types';
import withLocalize, {withLocalizePropTypes} from '../../components/withLocalize';
import ONYXKEYS from '../../ONYXKEYS';
import Navigation from '../../libs/Navigation/Navigation';
import compose from '../../libs/compose';
import * as IOU from '../../libs/actions/IOU';
import RequestDescription from '../../components/RequestDescription';

const propTypes = {
    ...withLocalizePropTypes,

    /** Onyx Props */
    /** Holds data related to Money Request view state, rather than the underlying Money Request data. */
    iou: PropTypes.shape({
        comment: PropTypes.string,
    }),
};

const defaultProps = {
    iou: {
        comment: '',
    },
};

/**
 * Sets the money request comment by saving it to Onyx.
 *
 * @param {Object} value
 * @param {String} value.moneyRequestComment
 */
function updateComment(value) {
    IOU.setMoneyRequestDescription(value.moneyRequestComment);
    Navigation.goBack();
}

/**
 * Goes back and clears the description from Onyx.
 */
function onBackButtonPress() {
    IOU.setMoneyRequestDescription('');
    Navigation.goBack();
}

function MoneyRequestDescriptionPage(props) {
    return (
        <RequestDescription
            onBackButtonPress={onBackButtonPress}
            submit={updateComment}
            validate={() => ({})}
            headerTitle={props.translate('common.description')}
            formID={ONYXKEYS.FORMS.MONEY_REQUEST_DESCRIPTION_FORM}
            textInputID="moneyRequestComment"
            textInputLabel={props.translate('moneyRequestConfirmationList.whatsItFor')}
            textInputDefaultValue={props.iou.comment}
        />
    );
}

MoneyRequestDescriptionPage.propTypes = propTypes;
MoneyRequestDescriptionPage.defaultProps = defaultProps;
MoneyRequestDescriptionPage.displayName = MoneyRequestDescriptionPage;

export default compose(
    withLocalize,
    withOnyx({
        iou: {key: ONYXKEYS.IOU},
    }),
)(MoneyRequestDescriptionPage);
