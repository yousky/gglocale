var express = require('express');
var router = express.Router();

let localizeService = require('../services/localize');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'gglocalize' });
});

router.post('/api/Save', function (req, res, next) {
  let body = req.body;
  if (!body.DocKey || !body.SheetName || !body.KeyCol || !body.ValueCol) {
    res.sendStatus(400);
    return null;
  }

  localizeService.saveAsync(body.DocKey, body.AuthClientEmail, body.AuthPrivateKey, body.SheetName.toLowerCase(), body.KeyCol.toLowerCase(), body.ValueCol.toLowerCase(), body.FileType)
    .then(function (result) {

    res.send(result);
    return null;
  }).catch(function (err) {
    console.warn(err);
    if (err && err.code) {
      res.send(err.code, err.message);
    } else {
      res.send(500, 'err:' + err);
    }
    return null;
  });
});

module.exports = router;
