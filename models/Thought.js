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
    }
    // create virtual called reactionCount
);

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;