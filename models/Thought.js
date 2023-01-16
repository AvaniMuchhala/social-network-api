const { Schema, model } = require('mongoose');
const dayjs = require('dayjs');
const reactionSchema = require('./Reaction');

// Schema to create Thought model
const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: formatTimestamp
        },
        username: {
            type: String,
            required: true
        }, 
        reactions: [reactionSchema]
    },
    // Turn virtuals & getters on to see them in response
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
);

// Getter function to format timestamp on query
function formatTimestamp (time) {
    return dayjs(time).format('MMM D, YYYY [at] h:mm A');
}

// 'reactionCount' virtual property
thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;