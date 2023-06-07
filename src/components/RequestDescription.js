import React, {useRef} from 'react';
import {View} from 'react-native';
import Form from './Form';
import ScreenWrapper from './ScreenWrapper';
import HeaderWithBackButton from './HeaderWithBackButton';
import withLocalize, {withLocalizePropTypes} from './withLocalize';
import TextInput from './TextInput';
import styles from '../styles/styles';

const propTypes = {
    /* Onyx Props */
    ...withLocalizePropTypes,
};

function RequestDescription(props) {
    const inputRef = useRef(null);

    return (
        <ScreenWrapper
            includeSafeAreaPaddingBottom={false}
            shouldEnableMaxHeight
            onEntryTransitionEnd={() => inputRef.current && inputRef.current.focus()}
        >
            <HeaderWithBackButton
                title={props.headerTitle}
                shouldShowBackButton
                onBackButtonPress={props.onBackButtonPress}
                onCloseButtonPress={props.onCloseButtonPress}
            />
            <Form
                style={[styles.flexGrow1, styles.ph5]}
                formID={props.formID}
                validate={props.validate}
                onSubmit={props.submit}
                submitButtonText={props.translate('common.save')}
                enabledWhenOffline
            >
                <View style={[styles.mb4]}>
                    <TextInput
                        inputID={props.textInputID}
                        name={props.textInputID}
                        label={props.textInputLabel}
                        defaultValue={props.textInputDefaultValue}
                        ref={(el) => (inputRef.current = el)}
                    />
                </View>
            </Form>
        </ScreenWrapper>
    );
}

RequestDescription.propTypes = propTypes;
export default withLocalize(RequestDescription);
