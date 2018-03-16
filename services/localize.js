var GoogleSpreadsheet = require('google-spreadsheet');
let xmldom = require('xmldom');
let path = require('path');
let fs = require('fs');
let workDirectory = path.join(__dirname, '../');
var DOMParser = xmldom.DOMParser;
var serializer = new xmldom.XMLSerializer();

let createXml = function (rows, keyCol, localeCol) {

  var xmlbase = "<?xml version='1.0' encoding='utf-8'?><resources></resources>";
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(xmlbase, "text/xml");
  let elem = xmlDoc.getElementsByTagName("resources")[0];

  for (let index = 0; index < rows.length; index++) {
    let row = rows[index];
    let keyValue = row[keyCol];
    let localeValue = row[localeCol];
    if (!keyValue) {
      console.warn('keyValue null: index=' + index);
      continue;
    }

    var node = xmlDoc.createElement("string");
    node.setAttribute("name", keyValue);
    node.textContent = localeValue;
    elem.appendChild(node);
  }

  return serializer.serializeToString(xmlDoc);
}

let createXml4resxAsync = function (rows, keyCol, localeCol) {
  return new Promise(function (resolve, reject) {
    fs.readFile(path.join(workDirectory, 'Language.empty.resx'), 'utf8', function (err, xmlbase) {
      if (err) {
        return reject('readFile Error: ' + err);
      }
      let parser = new DOMParser();
      let xmlDoc = parser.parseFromString(xmlbase, "text/xml");
      let strEmpty = serializer.serializeToString(xmlDoc);
      let elem = xmlDoc.getElementsByTagName("root")[0];

      for (let index = 0; index < rows.length; index++) {
        let row = rows[index];
        // The key value of resx does not allow special characters such as spaces.
        let keyValue = row[keyCol];
        if (!keyValue) {
          console.warn('keyValue null: index=' + index);
          continue;
        }

        let localeValue = row[localeCol];
        if (localeValue) {
          // The line break character seems to be google /n. Convert to /r /n for windows C#
          localeValue = localeValue.replace(/\n/g, '\r\n');
        }

        let nodeName = xmlDoc.createElement("data");
        nodeName.setAttribute("name", keyValue);
        nodeName.setAttribute("xml:space", "preserve");
        let nodevalue = xmlDoc.createElement("value");
        nodevalue.textContent = localeValue;
        nodeName.appendChild(nodevalue);
        elem.appendChild(nodeName);
      }

      let str = serializer.serializeToString(xmlDoc);
      return resolve(str);
    })
  });
}

let createJson = function (rows, keyCol, localeCol) {

  let obj = {};
  for (let index = 0; index < rows.length; index++) {
    let row = rows[index];
    let keyValue = row[keyCol];
    let localeValue = row[localeCol];
    if (!keyValue) {
      console.warn('keyValue null: index=' + index);
      continue;
    }

    obj[keyValue] = localeValue;
  }

  return JSON.stringify(obj);
}

let saveAsync = function (docKey, authClientEmail, authPrivateKey, sheetName, keyCol, localeCol, fileType) {
  return new Promise(function (resolve, reject) {
    try {
      let doc = new GoogleSpreadsheet(docKey);
      let creds_json = null;
      if (authClientEmail && authPrivateKey) {
        creds_json = {
          client_email: authClientEmail,
          private_key: authPrivateKey
        }
      }
      let executeCreateFileStrAsync = function (err) {
        if (err) {
          return reject({ code: 500, message: 'Google Auth Error: ' + err });
        }
        doc.getInfo(function (err, info) {
          if (err) {
            return reject({ code: 500, message: 'Google Read[getInfo] Error: ' + err });
          }
          console.log('Loaded doc: ' + info.title + ' by ' + info.author.email);
          let sheet = null;
          for (let index = 0; index < info.worksheets.length; index++) {
            let sh = info.worksheets[index];
            if (sh.title.toLowerCase() === sheetName) {
              sheet = sh;
              break;
            }
          }
          if (sheet === null) {
            return reject({ code: 400, message: 'Not found sheet : ' + sheetName });
          }
          console.log('sheet 1: ' + sheet.title + ' ' + sheet.rowCount + 'x' + sheet.colCount);

          sheet.getRows({
            offset: 1
          }, function (err, rows) {
            if (err) {
              return reject({ code: 500, message: 'Google Read[getRows] Error: ' + err });
            }
            console.log('Read ' + rows.length + ' rows');

            let str = null;
            if (fileType == 'json') {
              str = createJson(rows, keyCol, localeCol);
              resolve(str);
            } else if (fileType == 'xml4android') {
              str = createXml(rows, keyCol, localeCol);
              resolve(str);
            } else {  //resx
              return createXml4resxAsync(rows, keyCol, localeCol).then(function (str) {
                resolve(str);
              }).catch(function (err) {
                return reject({ code: 500, message: 'createXml4resxAsync Error: ' + err });
              });
            }
            return
          });
        });
      }
      if (creds_json) {
        return doc.useServiceAccountAuth(creds_json, executeCreateFileStrAsync);
      } else {
        return executeCreateFileStrAsync();
      }

    } catch (err) {
      return reject({ code: 500, message: 'saveAsync Error: ' + err });
    }
  });
}

module.exports = {
  saveAsync: saveAsync
};