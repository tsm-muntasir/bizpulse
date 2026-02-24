const ApiError = require('../utils/ApiError');
const { verifyAccessToken } = require('../utils/jwt');
const { findPublicById } = require('../repositories/userRepository');

module.exports = async function authenticate(req, _res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Unauthorized');
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);
    const user = await findPublicById(payload.sub);
    if (!user || !user.isActive) throw new ApiError(401, 'Invalid token subject');

    req.user = { id: user._id.toString(), role: user.role, email: user.email };
    return next();
  } catch (err) {
    return next(new ApiError(401, 'Invalid or expired access token'));
  }
};
