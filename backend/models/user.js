import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
  fname: { type: String, required: true },
  mname: { type: String, required: true },
  lname: { type: String, required: true },
  studno: { type: String, required: false },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isApproved: { type: Boolean, required: true },
  type: { type: String, required: true },

  application: [{
    date_created: { type: Date, required: false },
    purpose: { type: String, required: false },
    githublink: { type: String, required: false },
    progress: { type: String, required: false },
    currentlyOpen: { type: Boolean, required: false },
    returned: { type: Boolean, required: false },
    remarks: { type: [String], required: false},
  }],

  adviser: { type: String, required: false },

});

UserSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  return bcrypt.genSalt((saltError, salt) => {
    if (saltError) { return next(saltError); }

    return bcrypt.hash(user.password, salt, (hashError, hash) => {
      if (hashError) { return next(hashError); }

      user.password = hash;
      return next();
    });
  });
});

UserSchema.methods.comparePassword = function (password, callback) {
  bcrypt.compare(password, this.password, callback);
}

mongoose.model("users", UserSchema);
