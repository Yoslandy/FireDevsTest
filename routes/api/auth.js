const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jsonwt = require("jsonwebtoken");
const auth = require('../../middleware/auth');
//User Model
const User = require('../../models/User');

//@route POST api/auth
//@desc Auth user
//@access Public
//loguearse

router.post('/', (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' })
    }

    User.findOne({ email })
        .then(user => {
            if (!user) return res.status(400).json({ msg: 'User Does not exists' });
            //si el usuario esta inactivo retornar el error
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' })
                    if (!user.active) return res.status(400).json({ msg: 'User disabled. Check administrator' })
                    jsonwt.sign(
                        { id: user.id },
                        config.get('jwtSecret'),
                        { expiresIn: 3600 },
                        (err, token) => {
                            if (err) throw err;
                            res.json({
                                token,
                                user: {
                                    _id: user.id,
                                    name: user.name,
                                    email: user.email,
                                    admin: user.admin,
                                    active: user.active,
                                    image: user.image,
                                    image_name: user.image_name
                                }
                            })
                        }
                    )
                })
        })

});

//@route PUT api/auth/changepass
//@desc Change Password
//@access Public
//Cambias la contrasena

router.put('/changepass', (req, res) => {
    const { user, values } = req.body
    try {
        User.findById(user._id)
        .then(userdb => {
            if (!userdb) return res.status(400).json({ msg: 'User Does not exists' });
            bcrypt.compare(values.oldpassword, userdb.password)
                .then(isMatch => {
                    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials.' })
                    if (!userdb.active) return res.status(400).json({ msg: 'User disabled.' })
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(values.newpassword, salt, (err, hash) => {
                            if (err) throw err;
                            user.password = hash;
                            var newUser = user;
                            User.findById(user._id)
                                .then(user => user.updateOne(newUser)
                                    .then(() => res.json({ success: true, user: user })))
                                .catch(err => res.status(404).json({ msg: "El elemento no existe" }));
                        });
                    });
                })
        })
    } catch (error) {
        throw error
    }
});


//@route GET api/auth/user
//@desc Get user data
//@access Private
//Obtener el usuario logueado

router.get('/user', auth, (req, res) => {
    User.findById(req.user.id)
        .select('-password')
        .then(user => {
            if (!user) return res.status(400).json({ msg: 'User Does not exists' });
            res.json(user);
        })

});

module.exports = router;