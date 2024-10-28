const validImageFormats = ['jpg', 'jpeg', 'png'];

const validateImageFormat = (filename) => {
  const extension = filename.split('.').pop().toLowerCase();
  return validImageFormats.includes(extension);
};

module.exports = {
  validateImageFormat,
};
