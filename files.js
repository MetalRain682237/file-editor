const fs = require('fs');

function readFile(filePath, encoding) { //read a file
    return new Promise(resolve => {
        try {
            fs.readFile(filePath, encoding, (err, data) => {
                return resolve(data);
            });
        } catch (error) {
            console.log(error);
        }
    });
}

function readDirectory(filePath) { //gets a list of directories and files in a folder
    return new Promise(resolve => {
        try {
            fs.readdir(filePath, 'utf8', (err, data) => {
                return resolve(data);
            });
        } catch (error) {
            console.log(error);
        }
    });
}

function writeFile(filePath, encoding, data) { //write a file

    if ((!data) || (data.length == 0)) {
        return
    }

    fs.writeFile(filePath, data, { encoding: encoding }, function (err) {
        if (err) {
            console.log(err);
        } else {
            // console.log("saved");
        }
    });
}

module.exports.readFile = readFile;
module.exports.readDirectory = readDirectory;
module.exports.writeFile = writeFile;