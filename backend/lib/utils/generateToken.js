import Jwt from 'jsonwebtoken';

export const generateToken = (id) => {
    const token = Jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: '30d' } // Token will expire in 30 days
    );
    return token;
}

export const generateTokenAndSetCookie = (userId, res) => {
    const token = generateToken({ userId });

    // Set the token in a cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set to true in production
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
};

export const verifyToken = (token) => {
    try {
        return Jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null; // Token is invalid or expired
    }
}