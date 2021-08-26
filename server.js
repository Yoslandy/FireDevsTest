const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
var env = require('node-env-file');
env(__dirname + '/.env')

const app = express();

//Uso de Cors
var cors = require('cors');
app.use(cors());

//Bodyparser Middleware
app.use(express.json());

//DB Config
var db = process.env.MONGO_URI;

//Connect Mongodb
mongoose.Promise = global.Promise;
mongoose
    .connect(process.env.MONGODB_URI || db, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

//Use Routes
app.use('/api/groups', require('./routes/api/group'));
app.use('/api/students', require('./routes/api/student'));

//Serve static assets if in producton
if (process.env.NODE_ENV === 'production') {

    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));