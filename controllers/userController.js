const { User, Thought } = require('../models');

module.exports = {
    // Get all users
    async getUsers(req, res) {
        try {
            const users = await User.find().select('-__v');
            res.status(200).json(users);
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },
    // Get single user by its _id & populated thought and friend data
    async getSingleUser(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.userId })
                .populate('thoughts').populate('friends').select('-__v');
            res.status(200).json(user);
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },
    // Create new user
    async createUser(req, res) {
        try {
            const newUser = await User.create(req.body);
            res.status(200).json(newUser);
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },
    // Update a user by its _id
    async updateUser(req, res) {
        try {
            const updatedUser = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                // Validate new info in req.body, return updated user
                { runValidators: true, new: true }
            ).select('-__v');
            res.status(200).json(updatedUser);
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },
    // Delete a user by its _id, along with their associated thoughts
    async deleteUser(req, res) {
        try {
            const user = await User.findOneAndDelete({ _id: req.params.userId });
            if (!user) {
                res.status(404).json({ message: 'No user found with that ID' });
            } else {
                // If user with same ID found/deleted, delete their associated thoughts
                // Delete thoughts with same IDs listed in User's thoughts array field
                await Thought.deleteMany({ _id: { $in: user.thoughts } });
                res.status(200).json({ message: `User ${user.username} and their thoughts deleted` });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },
    // Add new friend to user's friend list
    async addFriend(req, res) {
        try {
            const newFriend = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.params.friendId } },
                // Return the updated user with new friend added
                { new: true }
            ).select('-__v');
            res.status(200).json(newFriend);
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    },
    // Remove friend from user's friend list
    async deleteFriend(req, res) {
        try {
            const result = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } },
                { runValidators: true, new: true }
            );
            res.status(200).json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    }
};