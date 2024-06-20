import mongoose from "mongoose";
import validator from 'validator';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const userModel = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "firstName is require"]
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: [true, 'Email is require'],
        unique: true,
        validate: validator.isEmail
    },
    password: {
        type: String,
        required: [true, 'password is require'],
        minlength: [6, "Password length should be greater than 6 character"],
        select: true
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone Number is require'],
        maxlength: [10, "phone number length should be 10 digit"],
        validate: validator.isMobilePhone
    },
    role: {
        type: String,
        enum: ['admin', 'editor', 'view'],
        required: [true, 'Role is required']
    },
}, {
    timestamps: true
})

userModel.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) return next();
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);

    } catch (error) {
        next(error);
    }
});


//Creating JWT
userModel.methods.createJWT = function () {
    return JWT.sign({ userId: this._id, firstName: this.firstName, email: this.email, role: this.role }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
};

userModel.methods.comparePassword = function (userPassword) {
    return bcrypt.compare(userPassword, this.password);
};


export default mongoose.model('User', userModel);
