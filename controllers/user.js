const User = require('../modals/User');
module.exports.signupUser =  (req, res) => {
    res.render('user/signup.ejs');
}

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newData = new User({ email, username });
        const registerUser = await User.register(newData, password);
        req.login(registerUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome to Wonderlust');
            res.redirect('/listing');
        })

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }
}

module.exports.renderLogin =  (req, res) => {
    res.render('user/login.ejs');
}

module.exports.login = async (req, res) => {
    let redirectUrl = res.locals.redirectUrl || '/listing';
    req.flash('success', 'welcome to Wonderlust');
    res.redirect(redirectUrl);
}

module.exports.logoutUser =  (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'You have logged out!!')
        res.redirect('/listing');

    })

}