import User from "../model/User.model.js";
import bcrypt from "bcrypt";
import LocalStrategy from "passport-local";

export default function (passport) {
    passport.use(
        new LocalStrategy(
            {
                usernameField: "email",
            },
            async (email, password, done) => {
                try {
                    const user = await User.findOne({ email });
                    if (!user) {
                        return done(null, false, { message: "Incorrect email or password" });
                    }
                    const isMatch = await bcrypt.compare(password, user.password);
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: "Incorrect email or password" });
                    }
                } catch (error) {
                    return done(`error: ${error.message}`);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id)
            .then((user) => {
                done(null, user);
            })
            .catch((error) => {
                done(error, null);
            });
    });
};