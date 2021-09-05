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
            let newHead = addToHTMLHeadString(htmlHeadString, addString);
            let newFile = replaceHTMLHeadString(file, htmlHeadString, newHead);

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
            let newHead = await removeFromHTMLHeadString(htmlHeadString, removeString);
            let newFile = replaceHTMLHeadString(file, htmlHeadString, newHead);

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
    let newFile = (`${headString}\n    ${addString}\n`);

    return newFile;
}

function removeFromHTMLHeadString(headString, removeString) {
    return new Promise(resolve => {
        let lines = headString.split("\n");
        let newFile = "";
        
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            
            if (!line.includes(removeString)) {
                newFile += line;
            }
            
            if (i == (lines.length - 1)) {
                newFile += "\n";
                return resolve(newFile);
            }
        }
    });
}

function formatHTMLHead(headString) {
    return new Promise(resolve => {
        let lines = headString.split("\n");
        let newLines = new Array(lines.length);

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            let type = line.split(" ")[0].replace(/</g, "");

            if (settings.html.headOrder.indexOf(type) != -1) {
                newLines[settings.html.headOrder.indexOf(type)];
            }
        }
    });
}

module.exports = { addToHTMLHead, removeFromHTMLHead }