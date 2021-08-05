let settings = require('./fesettings.json');
const { readFile, readDirectory, writeFile } = require('./files');

async function removeFileString(firstDir, directories, removeString) {

    if ((!removeString) || (removeString.length == 0)) {
        return;
    }

    let files = await editSearch(firstDir, directories, "", removeString);

    for (let i = 0; i < files.length; i++) {
        let dir = files[i];

        let file = await readFile(dir, 'utf8');

        let reg = new RegExp(removeString, "g");

        file = file.replace(reg, "");

        writeFile(dir, 'utf8', file);
    }
}

async function replaceFileString(firstDir, directories, replaceFrom, replaceWith) {
    let files = await editSearch(firstDir, directories, replaceFrom);

    for (let i = 0; i < files.length; i++) {
        let dir = files[i];

        let file = await readFile(dir, 'utf8');

        file = file.replace(replaceFrom, replaceWith);

        writeFile(dir, 'utf8', file);
    }
}

async function editSearch(firstDir, directories, replaceFrom, searchString) { //search a directory and all sub directories
    return new Promise(resolve => {
        asyncsearch();
        async function asyncsearch() {

            let needToEdit = new Array(); //files that will be edited

            for (let dir = 0; dir < directories.length; dir++) { //loop through all directories we need to search
                let currentDir = directories[dir];
                let contents = await readDirectory((firstDir + currentDir));

                if ((!contents) || (contents.length == 0)) { //folder not found or has no contents
                    directories.splice(dir, 1); //remove current directory from the array
                    dir--;
                } else { //folder has contents
                    for (let i = 0; i < contents.length; i++) {
                        let name = contents[i];
                        let type = "Directory";

                        if ((!name.startsWith(".")) && (name.includes("."))) { //file
                            type = name.split(".")[1].toLowerCase(); //file type
                        }

                        if ((type != "Directory") && (settings.search.useSFT == true) && (settings.search.searchFileTypes.indexOf(type) == -1)) { //ignore ones the user doesn't want to search
                            continue;
                        }

                        if ((type != "Directory") && (settings.search.useIFT == true) && (settings.search.ignoreFileTypes.indexOf(type) != -1)) { //ignore ones the user doesn't want to search
                            continue;
                        }

                        if (type != "Directory") { //file

                            if (replaceFrom === undefined) { //just gettting all files
                                console.log(`${firstDir}${currentDir}\\${name}`);
                                needToEdit.push(`${firstDir}${currentDir}\\${name}`);
                            } else {
                                let data = await readFile(`${firstDir}\\${currentDir}\\${name}`, 'utf8');

                                if (data) {
                                    let contains;
                                    if (replaceFrom.length > 0) {
                                        contains = await searchFileOneString(data, replaceFrom);
                                    } else {
                                        contains = await searchFile(data, searchString);
                                    }

                                    if (contains == true) { //found the text we wanted
                                        console.log(`${firstDir}${currentDir}\\${name}`);
                                        needToEdit.push(`${firstDir}${currentDir}\\${name}`);
                                    }
                                }
                            }
                        } else if ((type == "Directory") && (settings.global.readSubFolders == true) && (settings.global.ignoreFolders.indexOf(name) == -1)) { //directory
                            directories.push(`${currentDir}\\${name}`);
                            // console.log(`${currentDir}\\${name}`);
                        }
                    }
                }
                if (dir == (directories.length - 1)) {
                    // console.log(`Found ${numGoodFiles} files matching the criteria out of ${numFiles} files in ${numFolders} folders.`);
                    return resolve(needToEdit);
                }
            }
        }
    });
}

function searchFile(data, searchString) {
    return new Promise(resolve => {
        if ((data) && (data.includes(searchString))) {
            return resolve(true);
        } else {
            return resolve(false);
        }
    });
}

function searchFileOneString(data, replaceFrom) {
    return new Promise(resolve => {
        if ((data) && (data.includes(replaceFrom))) {
            return resolve(true);
        } else {
            return resolve(false);
        }
    });
}

module.exports = { removeFileString, replaceFileString, editSearch }