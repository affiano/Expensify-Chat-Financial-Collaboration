import React, {useCallback} from 'react';
import PropTypes from 'prop-types';
import {withOnyx} from 'react-native-onyx';
import withLocalize, {withLocalizePropTypes} from '../../components/withLocalize';
import ONYXKEYS from '../../ONYXKEYS';
import Navigation from '../../libs/Navigation/Navigation';
import compose from '../../libs/compose';
import reportPropTypes from '../reportPropTypes';
import * as TaskUtils from '../../libs/actions/Task';
import ROUTES from '../../ROUTES';
import RequestDescription from '../../components/RequestDescription';

const propTypes = {
    /** Current user session */
    session: PropTypes.shape({
        email: PropTypes.string.isRequired,
    }),

    /** Task Report Info */
    task: PropTypes.shape({
        /** Title of the Task */
        report: reportPropTypes,
    }),

    /* Onyx Props */
    ...withLocalizePropTypes,
};

const defaultProps = {
    session: {},
    task: {},
};

function TaskDescriptionPage(props) {
    const validate = useCallback(() => ({}), []);

    const submit = useCallback(
        (values) => {
            // Set the description of the report in the store and then call TaskUtils.editTaskReport
            // to update the description of the report on the server
            TaskUtils.editTaskAndNavigate(props.task.report, props.session.email, '', values.description, '');
        },
        [props],
    );

    return (
        <RequestDescription
            headerTitle={props.translate('newTaskPage.task')}
            onBackButtonPress={() => Navigation.goBack(ROUTES.NEW_TASK)}
            onCloseButtonPress={() => TaskUtils.dismissModalAndClearOutTaskInfo()}
            formID={ONYXKEYS.FORMS.EDIT_TASK_FORM}
            validate={validate}
            submit={submit}
            textInputID="description"
            textInputLabel={props.translate('newTaskPage.descriptionOptional')}
            textInputDefaultValue={(props.task.report && props.task.report.description) || ''}
        />
    );
}

TaskDescriptionPage.propTypes = propTypes;
TaskDescriptionPage.defaultProps = defaultProps;

export default compose(
    withLocalize,
    withOnyx({
        session: {
            key: ONYXKEYS.SESSION,
        },
        task: {
            key: ONYXKEYS.TASK,
        },
    }),
)(TaskDescriptionPage);
