const express = require('express');
const store = require('./store/binStore');

function createRouter() {
  const router = express.Router();

  router.get('/bins', (req, res) => {
    res.json(store.getAll());
  });

  router.get('/health', (req, res) => {
    res.json({ status: 'ok', bins: store.getAll().length });
  });

  return router;
}

module.exports = createRouter;
