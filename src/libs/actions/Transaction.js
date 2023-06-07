import _ from 'underscore';
import Onyx from 'react-native-onyx';
import * as API from '../API';
import ONYXKEYS from '../../ONYXKEYS';

/**
 * @param {object} changes
 * @param {number} [changes.amount]
 * @param {string} [changes.currency]
 * @param {string} [changes.modifiedCreated]
 * @param {string} [changes.comment]
 * @param {string} transactionID
 * @param {object} iouReportID
 * @param {string} parentReportActionID
 */
function updateTransaction(changes, transactionID, iouReportID, parentReportActionID) {
    const optimisticData = [];
    optimisticData.push({
        onyxMethod: Onyx.METHOD.MERGE,
        key: `${ONYXKEYS.COLLECTION.TRANSACTION}${transactionID}`,
        value: changes,
    });

    // We are not storing the modifiedCreated on the reportAction so remove it if added from the "original message"
    optimisticData.push({
        onyxMethod: Onyx.METHOD.MERGE,
        key: `${ONYXKEYS.COLLECTION.REPORT_ACTIONS}${parentReportActionID}`,
        value: {originalMessage: _.omit(changes, 'modifiedCreated')},
    });

    // If the amount changed then the total for the iouReport needs to be optimistically re-calculated
    if (_.has(changes, 'amount')) {
        optimisticData.push({
            onyxMethod: Onyx.METHOD_MERGE,
            key: `${ONYXKEYS.COLLECTION.REPORT}${iouReportID}`,
            value: {
                // todo - somehow calculate the report total :shrug:
                total: 0
            },
        });
    }

    const params = {};
    const onyxData = {
        optimisticData,
        successData: [

        ],
        failureData: [

        ],
    };
    API.write('UpdateTransaction', params, onyxData);
}

export {
    // eslint-disable-next-line import/prefer-default-export
    updateTransaction,
};