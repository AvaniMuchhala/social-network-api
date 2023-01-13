const { Schema, model } = require('mongoose');
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
            // getter method to format timestamp
        },
        username: {
            type: String,
            required: true
        }, 
        reactions: [reactionSchema]
    },
    // Turn virtuals on to see them in response
    {
        toJSON: {
            virtuals: true,
        },
        id: false
    }
);

// 'reactionCount' virtual property
thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;