const router = require('express').Router();
const User = require('../models/User');
const passport = require('passport');

router.get('/users/signin',(req, res)=>{
    res.render('users/signin');
});

router.post('/users/signin',passport.authenticate('local',{
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}));


router.get('/users/signup',(req, res)=>{
    res.render('users/signup');
});

router.post('/users/signup', async (req, res)=>{
    const {name, email, password, confirm_password} = req.body;
    const errors = [];
    if(!name) {
        errors.push({text: 'Please type a name'});
    }
    if(!email) {
        errors.push({text: 'Please type an email'});
    }
    if(password.length == 0) {
        errors.push({text: 'Please provide a password'});
    }
    if(password != confirm_password){
        errors.push({text: 'Password does not match'});
    }
    if(password.length < 8 & password.length != 0){
        errors.push({text: 'Password must have at least 8 caracters'});
    }
    if(errors.length > 0){
        res.render('users/signup', {errors, name, email, password, confirm_password});
    }
        if(await User.findOne({email: email})){
            req.flash('error_msg', "Email already in use");
            res.redirect('/users/signup');
        }else{
            const newUser = new User({name, email, password});
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save(); 
            req.flash('success_msg', 'User saved successfully');
            res.redirect('/users/signin'); 
        }
    
});

router.get('/users/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;