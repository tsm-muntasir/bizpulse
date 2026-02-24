const env = require('../config/env');
const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/authService');

function refreshCookieOptions() {
  return {
    httpOnly: true,
    secure: env.isProd,
    sameSite: env.isProd ? 'none' : 'lax',
    domain: env.cookieDomain,
    path: '/api/v1/auth/refresh',
    maxAge: 7 * 24 * 60 * 60 * 1000
  };
}

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.cookie('refreshToken', result.refreshToken, refreshCookieOptions());
  return res.status(201).json({ accessToken: result.accessToken, user: result.user });
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body, req.headers['user-agent'], req.ip);
  res.cookie('refreshToken', result.refreshToken, refreshCookieOptions());
  return res.status(200).json({ accessToken: result.accessToken, user: result.user });
});

const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  const result = await authService.rotateRefreshToken(token, req.headers['user-agent'], req.ip);
  res.cookie('refreshToken', result.refreshToken, refreshCookieOptions());
  return res.status(200).json({ accessToken: result.accessToken, user: result.user });
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.cookies.refreshToken);
  res.clearCookie('refreshToken', refreshCookieOptions());
  return res.status(204).send();
});

const csrfToken = asyncHandler(async (req, res) => {
  return res.status(200).json({ csrfToken: req.csrfToken() });
});

module.exports = { register, login, refresh, logout, csrfToken };
