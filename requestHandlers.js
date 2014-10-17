var formidable = require("formidable");
var fs = require("fs");

function start(response) {
  var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html; '+
    'charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/upload" enctype="multipart/form-data" '+
    'method="post">'+
    '<input type="file" name="upload" multiple="multiple">'+
    '<input type="submit" value="Upload file" />'+
    '</form>'+
    '</body>'+
    '</html>';
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write(body);
  response.end();
}

function upload(response, request) {
  if (request.method.toLowerCase() == "post") {
    var form = new formidable.IncomingForm();
    form.uploadDir = "tmp";
    fs.exists(form.uploadDir, function(exists) {
      if (!exists) {
        fs.mkdir(form.uploadDir, function(err) {
          if (!err) {
            form.parse(request, function(error, fields, files) {
              fs.renameSync(files.upload.path, "tmp/test.png");
              uploadHandle(response);
            });
          }
        });
      } else {
        form.parse(request, function(error, fields, files) {
          fs.renameSync(files.upload.path, "tmp/test.png");
          uploadHandle(response);
        });
      }
    });
  } else {
    uploadHandle(response);
  }
}

function show(response) {
  fs.readFile("tmp/test.png", "binary", function(error, file) {
    if (error) {
      response.writeHead(500, {"Content-Type": "text/plain"});
      response.write("error + \n");
      response.end();
    } else {
      response.writeHead(200, {"Content-Type": "image/png"});
      response.write(file, "binary");
      response.end();
    }
  });
}

function uploadHandle(response) {
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write("received image:\n\n");
  response.write("<img src='/show' />");
  response.end();
}

exports.start = start;
exports.upload = upload;
exports.show = show;