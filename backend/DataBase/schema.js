const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    }
});

const currentDate = new Date();

const options = { day: 'numeric', month: 'long', year: 'numeric' };
const formattedDate = currentDate.toLocaleDateString('en-US', options);
const blogSchema = new mongoose.Schema({
    img: {
        type: String,
        required: true,
        unique: true,
    },
    heading: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    smallblog: {
        type: String,
        required: true,
        trim: true,
    },
    bigblog: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: String,
        default: `${formattedDate}`
    }
})

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
})

const blogCollection = new mongoose.model('blogs', blogSchema);
const collection = new mongoose.model('user', userSchema);
const ContactCollection = new mongoose.model('contact', contactSchema);


module.exports = { collection, blogCollection, ContactCollection };