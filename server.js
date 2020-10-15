const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const config = require('config');

const app = express();

//Uso de Cors
var cors = require('cors');
app.use(cors());

//Bodyparser Middleware
app.use(express.json());

//DB Config
var db = config.get('mongoURI');

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
app.use('/api/censo', require('./routes/api/censo'));
/* app.use('/api/items', require('./routes/api/items'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/places', require('./routes/api/places'));
app.use('/api/packs', require('./routes/api/packs')); */

//Serve static assets if in producton
if (process.env.NODE_ENV === 'production') {

    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));