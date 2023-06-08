import PropTypes from 'prop-types';

export default PropTypes.shape({
    /** Amount of the transaction - negative number */
    amount: PropTypes.number,

    /** Original ISO timestamp the transaction was created */
    created: PropTypes.string,

    /** Currency string e.g. USD, GBP, etc */
    currency: PropTypes.string,

    /** Updated amount */
    modifiedAmount: PropTypes.number,

    /** Updated created */
    modifiedCreated: PropTypes.string,

    /** Unique identifier for the transaction */
    transactionID: PropTypes.string,

    /** Additional JSON value for a transaction. Similar to a reportAction.message JSON. */
    comment: PropTypes.shape({
        /** Slightly confusing, but this is where the "Description" for a standard expense typically goes */
        comment: PropTypes.string,
    }),
});