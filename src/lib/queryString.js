module.exports.queryString = obj =>
  Object.entries(obj)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
