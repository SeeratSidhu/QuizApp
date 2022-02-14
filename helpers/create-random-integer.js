
const generateRandomInteger = () => {
  const value = Math.floor(Math.random() * 899999 + 100000);
  return value;
}

module.exports = { generateRandomInteger }