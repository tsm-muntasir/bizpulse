module.exports = function notFound(_req, res) {
  return res.status(404).json({ message: 'Route not found' });
};
