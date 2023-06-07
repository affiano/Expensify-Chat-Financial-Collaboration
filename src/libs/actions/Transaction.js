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
 * @param {object} iouReportID this is the report of type iou or expense
 * @param {string} iouReportActionID reportAction action: 'IOU' type: 'create' - the originalMessage stores some details about the transaction
 */
function updateTransaction(changes, transactionID, iouReportID, iouReportActionID) {
    // With the exception of modifiedCreated all the params are the ones the API expects
    const params = _.omit(changes, 'modifiedCreated');
    params.transactionID = transactionID;
    params.reportID = iouReportID;

    if (changes.modifiedCreated) {
        params.created = changes.modifiedCreated;
    }

    const optimisticData = [];
    optimisticData.push({
        onyxMethod: Onyx.METHOD.MERGE,
        key: `${ONYXKEYS.COLLECTION.TRANSACTION}${transactionID}`,
        value: changes,
    });

    // We are not storing the modifiedCreated on the reportAction so remove it if added from the "original message"
    optimisticData.push({
        onyxMethod: Onyx.METHOD.MERGE,
        key: `${ONYXKEYS.COLLECTION.REPORT_ACTIONS}${iouReportActionID}`,
        value: {originalMessage: _.omit(changes, 'modifiedCreated')},
    });

    // If the amount changed then the total for the iouReport needs to be optimistically re-calculated
    if (_.has(changes, 'amount')) {
        optimisticData.push({
            onyxMethod: Onyx.METHOD.MERGE,
            key: `${ONYXKEYS.COLLECTION.REPORT}${iouReportID}`,
            value: {
                // todo - somehow calculate the report total :shrug:
                total: 0,
            },
        });
    }

    const onyxData = {
        optimisticData,
        successData: [],
        failureData: [],
    };
    API.write('UpdateTransaction', params, onyxData);
}

export {
    // eslint-disable-next-line import/prefer-default-export
    updateTransaction,
};
