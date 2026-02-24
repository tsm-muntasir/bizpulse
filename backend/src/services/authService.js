const { v4: uuidv4 } = require('uuid');
const ApiError = require('../utils/ApiError');
const { hashValue, compareHash } = require('../utils/hash');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const userRepo = require('../repositories/userRepository');
const refreshTokenRepo = require('../repositories/refreshTokenRepository');

async function register(input) {
  const existing = await userRepo.findByEmail(input.email);
  if (existing) throw new ApiError(409, 'Email already in use');

  const passwordHash = await hashValue(input.password);
  const user = await userRepo.createUser({
    fullName: input.fullName,
    email: input.email,
    university: input.university,
    passwordHash
  });

  return issueTokens(user, null, null);
}

async function login(input, userAgent, ipAddress) {
  const user = await userRepo.findByEmail(input.email);
  if (!user || !user.isActive) throw new ApiError(401, 'Invalid credentials');

  const matched = await compareHash(input.password, user.passwordHash);
  if (!matched) throw new ApiError(401, 'Invalid credentials');

  await userRepo.updateLastLogin(user._id);
  return issueTokens(user, userAgent, ipAddress);
}

async function rotateRefreshToken(rawRefreshToken, userAgent, ipAddress) {
  const payload = verifyRefreshToken(rawRefreshToken);
  const currentToken = await refreshTokenRepo.findActiveByJti(payload.jti);
  if (!currentToken) throw new ApiError(401, 'Refresh token not active');

  const isMatch = await compareHash(rawRefreshToken, currentToken.tokenHash);
  if (!isMatch) {
    await refreshTokenRepo.revokeAllForUser(payload.sub);
    throw new ApiError(401, 'Refresh token reuse detected; all sessions revoked');
  }

  const user = await userRepo.findPublicById(payload.sub);
  if (!user) throw new ApiError(401, 'Invalid refresh token user');

  const tokenPair = await issueTokens(user, userAgent, ipAddress);
  await refreshTokenRepo.revokeToken(currentToken._id, tokenPair.refreshTokenRecordId);

  return tokenPair;
}

async function logout(rawRefreshToken) {
  if (!rawRefreshToken) return;
  try {
    const payload = verifyRefreshToken(rawRefreshToken);
    const currentToken = await refreshTokenRepo.findActiveByJti(payload.jti);
    if (currentToken) await refreshTokenRepo.revokeToken(currentToken._id);
  } catch (_err) {
    return;
  }
}

async function issueTokens(user, userAgent, ipAddress) {
  const jti = uuidv4();
  const accessToken = signAccessToken({ sub: user._id.toString(), role: user.role });
  const refreshToken = signRefreshToken({ sub: user._id.toString(), jti });

  const refreshPayload = verifyRefreshToken(refreshToken);
  const tokenHash = await hashValue(refreshToken);
  const record = await refreshTokenRepo.createToken({
    userId: user._id,
    jti,
    tokenHash,
    expiresAt: new Date(refreshPayload.exp * 1000),
    userAgent,
    ipAddress
  });

  return {
    accessToken,
    refreshToken,
    refreshTokenRecordId: record._id,
    user: {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      university: user.university
    }
  };
}

module.exports = { register, login, rotateRefreshToken, logout };
