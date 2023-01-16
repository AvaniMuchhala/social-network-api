const { Schema, Types } = require('mongoose');
const dayjs = require('dayjs');

const reactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },
        reactionBody: {
            type: String,
            required: true,
            maxlength: 280
        },
        username: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: formatTimestamp
        }
    },
    // Turn getters on to see them in response
    {
        toJSON: {
            getters: true
        },
        id: false
    }
);

// Getter function to format timestamp on query
function formatTimestamp (time) {
    return dayjs(time).format('MMM D, YYYY [at] h:mm A');
}

module.exports = reactionSchema;
