import React from 'react';
import moment from 'moment';
import lodashGet from 'lodash/get';
import withLocalize, {withLocalizePropTypes} from './withLocalize';
import Form from './Form';
import ONYXKEYS from '../ONYXKEYS';
import styles from '../styles/styles';
import NewDatePicker from './NewDatePicker';

const propTypes = {
    ...withLocalizePropTypes,
};

function RequestCreated(props) {
    const createdYear = String(moment(props.defaultValue).year());
    const selectedYear = lodashGet(props.route.params, 'year', createdYear);
    return (
        <Form
            style={[styles.flexGrow1, styles.ph5]}
            formID={ONYXKEYS.FORMS.REQUEST_CREATED_FORM}
            validate={() => ({})}
            onSubmit={props.submit}
            submitButtonText={props.translate('common.save')}
            enabledWhenOffline
        >
            <NewDatePicker
                inputID="created"
                label={props.translate('common.date')}
                defaultValue={props.defaultValue || ''}
                selectedYear={selectedYear}
            />
        </Form>
    );
}

RequestCreated.propTypes = propTypes;
RequestCreated.displayName = 'RequestCreated';

export default withLocalize(RequestCreated);
