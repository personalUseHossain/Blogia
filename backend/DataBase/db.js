const mongoose = require('mongoose');

mongoose.connect(process.env.DataBase_Url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('app is sucessfully connected with database'))
    .catch((err) => console.log(err))



