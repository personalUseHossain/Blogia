const mongoose = require('mongoose');

mongoose.connect(process.env.TEXT_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('app is sucessfully connected with database'))
    .catch((err) => console.log(err))



