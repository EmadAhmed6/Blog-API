const jwt = require('jsonwebtoken')

const verifyToken = (req,res,next) => {
    let token = req.headers.token;
    if (token) {
        try {
            if (token.startsWith('Bearer ')) {
                token = token.split(' ')[1];
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.user = decoded;
            next();
        } catch(err) {
            return res.status(401).json({message: "Invalid token"})
        }
    } else {
        return res.status(401).json({message: "No token provided"})
    }
}

const verifyAuthorizedToken = (req,res,next) => {
    verifyToken(req,res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            return res.status(403).json({message: "You are not allowed"})
        }
    })
} 
const verifyAdminToken = (req,res,next) => {
    verifyToken(req,res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            return res.status(403).json({message: "You are not allowed, only admin allowed"})
        }
    })
} 

module.exports = {
    verifyToken,
    verifyAuthorizedToken,
    verifyAdminToken,
}