const PORT = Number(process.env.PORT) || 3000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || '*';

module.exports = { PORT, CLIENT_ORIGIN };
