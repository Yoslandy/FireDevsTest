const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jsonwt = require("jsonwebtoken");
//User Model

const User = require('../../models/User');

//@route POST api/users
//@desc Register new user
//@access Public
//Registrar Usuario

router.post('/', (req, res) => {
    const { name, password } = req.body
    const newUser = new User({
        name,
        password,
    });
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
                .then(user => {
                    jsonwt.sign(
                        { id: user.id },
                        config.get('jwtSecret'),
                        { expiresIn: 3600 },
                        (err, token) => {
                            if (err) throw err;
                            res.json({
                                token,
                                user: {
                                    id: user.id,
                                    name: user.name,
                                }
                            })
                        }
                    )
                });
        });
    });
});



module.exports = router;