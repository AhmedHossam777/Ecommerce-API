require('express-async-errors');

const User = require('../models/User');
const AppError = require('../utils/AppError');
const {
	generateAccessToken,
	generateRefreshToken,
} = require('../utils/generateJWT');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const verifyToken = require('../utils/verifyToken');

const registerUser = async (req, res, next) => {
	const { username, email, password } = req.body;
	const dupUser = await User.findOne({ email: email });
	
	if (dupUser) {
		return next(new AppError('user already exist', 400));
	}
	const newUser = await User.create({
		username: username,
		email: email,
		password: password,
	});
	
	const [token, refreshToken] = await Promise.all([
		generateAccessToken(newUser),
		generateRefreshToken(newUser),
	]);
	
	res.status(201).json({
		status: 'success',
		username: username,
		email: email,
		token,
		refreshToken,
	});
};

const login = async (req, res, next) => {
	const { email, password } = req.body;
	
	if (!email || !password)
		return next(new AppError('Please provide email and password', 400));
	
	const user = await User.findOne({ email: email }).select('+password');
	if (!user) {
		return next(new AppError('User does not exist', 404));
	}
	
	const isMatch = await user.comparePassword(password);
	if (!isMatch) {
		return next(new AppError('Invalid credentials', 400));
	}
	
	const [token, refreshToken] = await Promise.all([
		generateAccessToken(user),
		generateRefreshToken(user),
	]);
	
	// Set the refresh token in a cookie
	res.cookie('refreshToken', refreshToken, {
		httpOnly: true, // Prevent access from client-side scripts
		secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
		sameSite: 'strict', // Prevent CSRF attacks
		maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days in milliseconds
	});
	
	res.status(200).json({
		status: 'success',
		message: 'logged in successfully',
		token,
	});
};

const refreshToken = async (req, res, next) => {
	const refreshToken = req.cookies.refreshToken;
	if (!refreshToken) {
		return next(new AppError('unAuthorized', 401));
	}
	
	const decoded = await verifyToken(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET
	);
	if (!decoded || decoded === 'TokenExpiredError') {
		return next(new AppError('invalid refresh token', 401));
	}
	
	const user = await User.findById(decoded.userId);
	if (!user) {
		return next(new AppError('user does not exist', 404));
	}
	
	const [token, newRefreshToken] = await Promise.all([
		generateAccessToken(user),
		generateRefreshToken(user),
	]);
	
	res.cookie('refreshToken', newRefreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: 1000 * 60 * 60 * 24 * 7,
	});
	
	res.status(200).json({
		status: 'success',
		token,
		newRefreshToken,
	});
};

const changePassword = async (req, res, next) => {
	const password = req.body.password;
	const newPassword = req.body.newPassword;
	const user = await User.findOne({ _id: req.user.id }).select('+password');
	
	if (!user) {
		return next(new AppError('unAuthorized', 401));
	}
	
	const isMatch = await user.comparePassword(password);
	if (!isMatch) {
		return next(new AppError('wrong password', 401));
	}
	
	user.password = newPassword;
	await user.save();
	
	res.status(200).json({
		status: 'success',
		message: 'password updated successfully',
	});
};
// const user = await User.findOne({ _id: req.user.id })
const forgetPassword = async (req, res, next) => {
	try {
		const { email } = req.body;
		const user = await User.findOne({ email: email });
		if (!user) {
			console.log('User not found');
			return next(new AppError('There is no user with that email!', 404));
		}
		const resetToken = await user.createPasswordResetToken();
		await user.save();
		await sendEmail({
			email: email,
			subject: 'Reset Token',
			message: resetToken,
		});
		
		res.status(200).json({
			status: 'success',
			message: 'Reset token sent to your email',
		});
	} catch (error) {
		console.error('Error in forgetPassword:', error);
		next(error);
	}
};

const resetPassword = async (req, res, next) => {
	const hashedToken = crypto
		.createHash('sha256')
		.update(req.params.token) // because you send the reset token with the url in resetPassword route
		.digest('hex');
	
	const user = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() },
	});
	
	if (!user) {
		return next(new AppError('Token is invalid or has expired', 400));
	}
	
	user.password = req.body.password; // we will send the new password via the request body
	
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;
	await user.save();
	
	const token = await generateAccessToken(user._id);
	res.status(200).json({
		status: 'success',
		token,
	});
};

const profileImageUpload = async (req, res, next) => {
	const user = await User.findOne({ _id: req.user.id });
	
	if (!user) {
		return next(new AppError('User does not exist', 400));
	}
	
	if (!req.file) {
		return next(new AppError('please upload an image', 400));
	}
	
	user.profilePhoto = req.file.path;
	await user.save();
	
	res.status(200).json({
		status: 'success',
		data: 'Photo uploaded successfully',
		user,
	});
};

const getAllUsers = async (req, res, next) => {
	const users = await User.find();
	if (!users) {
		return next(new AppError('there is no users yet', 404));
	}
	res.status(200).json({
		status: 'success',
		users,
	});
};

const getUser = async (req, res, next) => {
	const id = req.params.id;
	const user = await User.findById(id);
	if (!user) {
		return next(new AppError('user does not exist', 404));
	}
	
	res.status(200).json({
		status: 'success',
		user,
	});
};

const updateUser = async (req, res, next) => {
	const { username, email } = req.body;
	
	const user = await User.findOne({ _id: req.user.id });
	
	if (!user) {
		return next(new AppError('unAuthorized', 401));
	}
	
	user.username = username;
	user.email = email;
	
	await user.save();
	
	res.status(200).json({
		status: 'success',
		user,
	});
};

const deleteUser = async (req, res, next) => {
	const id = req.params.id;
	const user = await User.findById(id);
	if (!user) {
		return next(new AppError('user does not exist', 404));
	}
	await User.findByIdAndDelete(id);
	
	res.status(204).json({
		status: 'success',
		data: null,
	});
};

module.exports = {
	registerUser,
	getAllUsers,
	deleteUser,
	getUser,
	updateUser,
	profileImageUpload,
	login,
	changePassword,
	forgetPassword,
	resetPassword,
	refreshToken,
};
