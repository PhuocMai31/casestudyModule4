"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const passport_google_oauth2_1 = __importDefault(require("passport-google-oauth2"));
const account_model_1 = require("../schemas/account.model");
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    done(null, user);
});
passport_1.default.use('local', new passport_local_1.default(async (username, password, done) => {
    const user = await account_model_1.Account.findOne({ username: username });
    if (!user) {
        return done(null, false);
    }
    else {
        if (user.password == password) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    }
}));
passport_1.default.use(new passport_google_oauth2_1.default({
    clientID: '1079258411381-m5jfjtu1tn4cb1ugl8sdlvdf66n6espg.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:3000/auth/google/callback',
    passReqToCallback: true
}, async (request, accessToken, refreshToken, profile, done) => {
    try {
        let existingUser = await account_model_1.Account.findOne({ 'google_id': profile.id });
        console.log(typeof (profile.email));
        if (existingUser) {
            return done(null, existingUser);
        }
        else {
            const newUser = new account_model_1.Account({
                google_id: profile.id,
                username: profile.email,
                password: "Abcd123456",
                role: "user"
            });
            let userGoogle = await newUser.save();
            console.log('Is new User' + userGoogle);
            return done(null, newUser);
        }
    }
    catch (err) {
        console.log('error google login catch' + err.message);
        return done(null, false);
    }
}));
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map