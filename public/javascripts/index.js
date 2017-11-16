'use strict';

// Load Cookie values
$(document).ready(function(){
   let bodyCookie = getCookie('body');
   if(bodyCookie){
    let body = JSON.parse(bodyCookie);
    $("#DocKey").val(body.DocKey);
    $("#AuthClientEmail").val(body.AuthClientEmail);
    $("#AuthPrivateKey").val(body.AuthPrivateKey);
    $("#SheetName").val(body.SheetName);
    $("#KeyCol").val(body.KeyCol);
    $("#ValueCol").val(body.ValueCol);
    $("#FileType").val(body.FileType);
   }
});

$("#savebtn").click(function () {
  let DocKey = $("#DocKey").val();
  let AuthClientEmail = $("#AuthClientEmail").val();
  let AuthPrivateKey = $("#AuthPrivateKey").val().replace(/\\n/g,'\n'); //linebreak reverse escape
  let SheetName = $("#SheetName").val();
  let KeyCol = $("#KeyCol").val();
  let ValueCol = $("#ValueCol").val();
  let FileType = $( "#FileType" ).val();
  if (!DocKey || !SheetName || !KeyCol || !ValueCol) {
    alert("Fill each space.");
    return;
  }

  // Save Cookie. 1month.
  let body = { DocKey: DocKey, AuthClientEmail: AuthClientEmail, AuthPrivateKey: AuthPrivateKey, SheetName: SheetName, KeyCol: KeyCol, ValueCol: ValueCol, FileType: FileType };
  setCookie('body', JSON.stringify(body), 30*24*60*60);

  changeObjectDisableState($("#savebtn"), true);
  postSave(body);
});

function changeObjectDisableState(obj, disabled) {
  if (disabled === true) {
    obj.prop("disabled", true);
  } else {
    obj.prop("disabled", false);
  }
}

function postSave(body) {
  try {
    $.post("api/Save", body).then(function (data, textStatus, jqXHR) {
      if (body.FileType == 'json') {
        let blob = new Blob([data], {type: 'application/xml; charset=utf-8'})
        let filename = 'strings-' + body.ValueCol.toLowerCase() + '.json';
        saveAs(blob, filename);
      } else if (body.FileType == 'xml4android') {
        let blob = new Blob([data], {type: 'application/xml; charset=utf-8'})
        let filename = 'strings-' + body.ValueCol.toLowerCase() + '.xml';
        saveAs(blob, filename);
      } else {  //resx
        let blob = new Blob([data], {type: 'application/xml; charset=utf-8'})
        let filename = 'Language.' + body.ValueCol.toLowerCase() + '.resx';
        saveAs(blob, filename);
      }
      changeObjectDisableState($("#savebtn"), false);
    }, function (jqXHR, textStatus, errorThrown) {
      alert('status:' + jqXHR.status + ', message:' + jqXHR.responseText);
      console.log('error', errorThrown);
      changeObjectDisableState($("#savebtn"), false);
    });
  }
  catch (err) {
    console.log('err postSave: ', err);
    changeObjectDisableState($("#savebtn"), false);
  }
}


function setCookie(cname, cvalue, exseconds) {
  let d = new Date();
  d.setSeconds(d.getSeconds() + exseconds);
  let expires = "expires=" + d.toGMTString();
  document.cookie = cname + "=" + cvalue + "; " + expires;

}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}