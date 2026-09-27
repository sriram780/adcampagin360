export const allow = (...roles) => (req,res,next) => roles.includes(req.user.role) ? next() : res.status(403).json({ message: 'You do not have permission for this resource' });
