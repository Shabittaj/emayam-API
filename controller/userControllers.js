import userModel from '../model/userModel.js';

export const registerUser = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password, address, phoneNumber, role } = req.body;

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists', status: false });
        }

        const newUser = new userModel({
            firstName,
            lastName,
            email,
            password,
            address,
            phoneNumber,
            role
        });

        // Save user details with email verification OTP
        await newUser.save();

        const token = newUser.createJWT();

        res.status(201).json({
            message: 'User registered successfully. Verification OTP sent to email.',
            status: true,
            user: {
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                address: newUser.address,
                phoneNumber: newUser.phoneNumber,
                role: newUser.role
            }, token
        });

    } catch (error) {
        next(error);
    }
};

export const getAllUser = async (req, res, next) => {
    try {
        const users = await userModel.find();
        res.status(201).json(users);
    } catch (error) {
        next(error);
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password', status: false });
        }

        const token = user.createJWT();
        user.password = undefined;
        res.status(201).json({ user, token });
    } catch (error) {
        next(error);
    }
};

export const profile = async (req, res, next) => {
    try {
        const id = req.user.userId;
        const user = await userModel.findOne({ _id: req.user.userId }).select("firstName lastName role email phoneNumber -password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};