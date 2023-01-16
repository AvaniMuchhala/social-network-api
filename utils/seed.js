const connection = require('../config/connection');
const { User, Thought, Reaction } = require('../models');

console.time('seeding');

// Create connection to MongoDB
connection.once('open', async () => {
    // Delete entries in User and Thought collections
    await User.deleteMany({});
    await Thought.deleteMany({});

    // Insert mock user data
    const users = [
        {
            username: 'Jane',
            email: 'jane@gmail.com'
        },
        {
            username: 'Bob',
            email: 'bob@yahoo.com'
        }
    ];
    await User.collection.insertMany(users);

    // Insert mock thought data using mock users' IDs
    const userJane = await User.findOne({ username: 'Jane' });
    const userBob = await User.findOne({ username: 'Bob' });
    const thoughts = [
        {
            thoughtText: 'The bootcamp has been super helpful!',
            username: 'Jane',
            userId: userJane._id
        },
        {
            thoughtText: 'Mongoose is really cool!',
            username: 'Bob',
            userId: userBob._id
        }
    ];
    await Thought.collection.insertMany(thoughts);

    // Update mock users' thoughts array field
    const janeThought = await Thought.findOne({ username: 'Jane' });
    const bobThought = await Thought.findOne({ username: 'Bob' });
    await User.findOneAndUpdate( 
        { _id: userJane._id },
        { $push: { thoughts: janeThought._id } },
        { new: true }
    );
    await User.findOneAndUpdate( 
        { _id: userBob._id },
        { $push: { thoughts: bobThought._id } },
        { new: true }
    );

    console.timeEnd('seeding complete');
    process.exit(0);
});