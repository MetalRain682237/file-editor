const { editSearch } = require("./edit");
let settings = require('./fesettings.json');
const { readFile, writeFile } = require("./files");

async function addToHTMLHead(addString) {
    let files = await editSearch(settings.parentDirectoryPath, [""]);

    // if (!string.includes("\n")) { //if there is no newline at the end of it
    //     string = (string + "\n");
    // }

    for (let i = 0; i < files.length; i++) {
        let dir = files[i];

        let file = await readFile(dir, 'utf8');

        let htmlHeadString = getHTMLHeadString(file);
        
        if ((htmlHeadString) && (!htmlHeadString.includes(addString))) { //if we have a file and it doesn't contain the string we are looking for
            let newFile = addToHTMLHeadString(htmlHeadString, addString);
            
            writeFile(dir, 'utf8', newFile);
            console.log(`Changed ${dir}`);
        }
    }
}

async function removeFromHTMLHead(removeString) {
    let files = await editSearch(settings.parentDirectoryPath, [""]);
    
    for (let i = 0; i < files.length; i++) {
        let dir = files[i];
        
        let file = await readFile(dir, 'utf8');

        let htmlHeadString = getHTMLHeadString(file);

        if ((htmlHeadString) && (htmlHeadString.includes(removeString))) { //if we have a file and it does contain the string we are looking for
            let newFile = await removeFromHTMLHeadString(htmlHeadString, removeString);

            writeFile(dir, 'utf8', newFile);
            console.log(`Changed ${dir}`);
        }
    }
}

function getHTMLHeadString(file) {
    let topStringIndex = (file.split("<head>")[0].length + 6);
    let bottomStringIndex = (file.split("</head>")[0].length);

    let headString = file.substring(topStringIndex, bottomStringIndex);

    return headString;
}

function replaceHTMLHeadString(file, oldHead, newHead) {
    let newFile = file.replace(oldHead, newHead);

    return newFile;
}

function addToHTMLHeadString(headString, addString) {
    let newFile = (`${headString}\n    ${addString}`);

    return newFile;
}

function removeFromHTMLHeadString(head, removeString) {
    return new Promise(resolve => {
        let lines = head.split("\n");
        let newFile = "";

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];

            if (!line.includes(removeString)) {
                newFile += line;
            }

            if (i == (lines.length - 1)) {
                return resolve(newFile);
            }
        }
    });
}

module.exports = { addToHTMLHead, removeFromHTMLHead }