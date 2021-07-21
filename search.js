let settings = require('./fesettings.json');
const { readFile, readDirectory, writeFile } = require('./files');

async function search(firstDir, directories, string, args) { //search a directory and all sub directories for text
    let numFiles = 0; //number of files searched
    let numFolders = 0; //number of files searched
    let numGoodFiles = 0; //number of files that meet the search criteria
    let nameSearch = false;

    if (args.indexOf("-n") != -1) {
        nameSearch = true;
    }

    for (let dir = 0; dir < directories.length; dir++) { //loop through all directories we need to search
        let currentDir = directories[dir];
        let contents = await readDirectory((firstDir + currentDir));
        numFolders++;

        if ((!contents) || (contents.length == 0)) { //folder not found or has no contents
            directories.splice(dir, 1); //remove current directory from the array
            dir--;
        } else { //folder has contents
            for (let i = 0; i < contents.length; i++) {
                let name = contents[i];
                let type = "Directory";

                if ((!name.startsWith(".")) && (name.includes("."))) { //file
                    type = name.split(".")[1].toLowerCase(); //file type
                    numFiles++;
                }

                if ((type != "Directory") && (settings.search.useSFT == true) && (settings.search.searchFileTypes.indexOf(type) == -1)) { //ignore ones the user doesn't want to search
                    continue;
                }

                if ((type != "Directory") && (settings.search.useIFT == true) && (settings.search.ignoreFileTypes.indexOf(type) != -1)) { //ignore ones the user doesn't want to search
                    continue;
                }

                if (nameSearch == true) { //searching for file names
                    if (name.includes(string)) { //found the name we wanted
                        console.log(`${firstDir}${currentDir}\\${name}`);
                        numGoodFiles++;
                    }

                    if (name.includes(".")) { //skip if not a directory cause we don't need to look at the contents
                        continue;
                    }
                }

                if (type != "Directory") { //file
                    let data = await readFile(`${firstDir}\\${currentDir}\\${name}`, 'utf8');
                    
                    if (data) {
                        let contains = await searchFile(data, string);
                        
                        if (contains == true) { //found the text we wanted
                            console.log(`${firstDir}${currentDir}\\${name}`);
                            numGoodFiles++;
                        }
                    }
                } else if ((type == "Directory") && (settings.global.readSubFolders == true)) { //directory
                    directories.push(`${currentDir}\\${name}`);
                    // console.log(`${currentDir}\\${name}`);
                }
            }
        }
        if (dir == (directories.length - 1)) {
            console.log(`Found ${numGoodFiles} files matching the criteria out of ${numFiles} files in ${numFolders} folders.`);
        }
    }
}

function searchFile(data, string) {
    return new Promise(resolve => {
        if ((data) && (data.includes(string))) {
            return resolve(true);
        } else {
            return resolve(false);
        }
    });
}

module.exports.search = search;