const { User, Thought, Reaction } = require('../models');

module.exports = {
    // Get all thoughts
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find().select('-__v');
            res.status(200).json(thoughts);
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },
    // Get single thought by its _id
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId });
            if (!thought) {
                res.status(404).json({ message: 'No thought found with that ID' });
            } else {
                res.status(200).json(thought);
            }
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },
    // Create new thought
    async createThought(req, res) {
        try {
            const newThought = await Thought.create(req.body);
            // Find User with same userId provided in req.body
            // Push the newThought's ID to User's thoughts field
            const updatedUser = await User.findOneAndUpdate( 
                { _id: req.body.userId },
                { $push: { thoughts: newThought._id } },
                { new: true }
            );
            res.status(200).json({
                message: 'Created a new thought!',
                updatedUser: updatedUser
            });
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },
    // Update a thought (specifically thoughtText field) by its _id
    async updateThought(req, res) {
        try {
            const updatedThought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { new: true }
            );
            if (!updatedThought) {
                res.status(404).json({ message: 'No thought found with that ID' });
            } else {
                res.status(200).json(updatedThought);
            }
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },
    // Delete a thought by its _id, remove thought from User's thought field
    async deleteThought(req, res) {
        try {
            const result = await Thought.deleteOne({ _id: req.params.thoughtId });
            if (!result) {
                res.status(404).json({ message: 'No thought found with that ID' });
            } else {
                // Find User that has same thoughtId provided in req.params
                // Pull/remove the thought's ID from User's thoughts field
                const updatedUser = await User.findOneAndUpdate(
                    { thoughts: req.params.thoughtId },
                    { $pull: { thoughts: req.params.thoughtId } },
                    { new: true }
                );
                res.status(200).json({
                    message: 'Deleted thought!',
                    updatedUser: updatedUser
                });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },
    // Create a reaction and store in single thought's reactions array
    async createReaction(req, res) {
        try {
            const thoughtWithReaction = await Thought.findOneAndUpdate( 
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body } },
                { new: true }
            );
            if (!thoughtWithReaction) {
                res.status(404).json({ message: 'No thought found with that ID' });
            } else {
                res.status(200).json(thoughtWithReaction);
            }
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },
    // Delete a reaction by its reactionId from a thought
    async deleteReaction(req, res) {
        try {
            const updatedThought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.params.reactionId } } },
                { runValidators: true, new: true }
            );
            res.status(200).json(updatedThought);
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    }
};