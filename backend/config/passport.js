"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const User_1 = __importDefault(require("../models/User"));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback',
}, async (_accessToken, _refreshToken, profile, done) => {
    try {
        let user = await User_1.default.findOne({ googleId: profile.id });
        if (!user) {
            user = await User_1.default.findOne({ email: profile.emails?.[0].value });
            if (user) {
                user.googleId = profile.id;
                await user.save();
            }
            else {
                user = new User_1.default({
                    googleId: profile.id,
                    email: profile.emails?.[0].value,
                    fullName: profile.displayName,
                    role: 'user'
                });
                await user.save();
            }
        }
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await User_1.default.findById(id);
        done(null, user);
    }
    catch (error) {
        done(error);
    }
});
