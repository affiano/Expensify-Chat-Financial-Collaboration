import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native';
import Form from './Form';
import ScreenWrapper from './ScreenWrapper';
import HeaderWithBackButton from './HeaderWithBackButton';
import withLocalize, {withLocalizePropTypes} from './withLocalize';
import TextInput from './TextInput';
import styles from '../styles/styles';

const propTypes = {
    /** Default input value for text input  */
    textInputDefaultValue: PropTypes.string,

    /* Onyx Props */
    ...withLocalizePropTypes,
};

const defaultProps = {
    textInputDefaultValue: '',
};

function RequestDescription(props) {
    const inputRef = useRef(null);

    // Use the selection to place the cursor correctly if there is prior text
    const [selection, setSelection] = useState({start: 0, end: 0});

    useEffect(() => {
        if (!props.textInputDefaultValue) {
            return;
        }

        const length = props.textInputDefaultValue.length;
        setSelection({start: length, end: length});
    }, [props.textInputDefaultValue]);

    return (
        <ScreenWrapper
            includeSafeAreaPaddingBottom={false}
            shouldEnableMaxHeight
            onEntryTransitionEnd={() => inputRef.current && inputRef.current.focus()}
        >
            <HeaderWithBackButton title={props.headerTitle} />
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
                        autoGrowHeight
                        containerStyles={[styles.autoGrowHeightMultilineInput]}
                        textAlignVertical="top"
                        selection={selection}
                        onSelectionChange={(e) => {
                            setSelection(e.nativeEvent.selection);
                        }}
                    />
                </View>
            </Form>
        </ScreenWrapper>
    );
}

RequestDescription.propTypes = propTypes;
RequestDescription.defaultProps = defaultProps;
export default withLocalize(RequestDescription);
