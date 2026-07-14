const admin = (req, res, next) => {

    if (req.user && req.user.role === "admin") {
        return next();
    }

    return res.status(403).json({
        message: "Not authorized as an admin",
        role: req.user?.role
    });
};

module.exports = { admin };