const readline = require('readline');
const fs = require('fs');
let settings = require('./fesettings.json');
const { startup } = require('./startup');
const { readFile, readDirectory, writeFile } = require('./files');
const { search } = require('./search');
const { removeString, replaceString } = require('./edit');

startup();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.on('line', async (line) => {
    let message = line.toLowerCase();
    let args = message.split(" ");

    if (args[0] == "find") { //search for certain text in a file
        rl.question('What string do you want to search for: ', (answer) => {
            rl.question('What directory under the parent directory, if any: ', (answer2) => {
                if (answer2.length == 0) {
                    answer2 = "";
                } else {
                    if (!answer2.startsWith("\\")) {
                        answer2 = ("\\" + answer2);
                    }
                }
                search(settings.parentDirectoryPath, [answer2], answer, args);
            });
        });
    }

    if (args[0] == "edit") {
        if (args.indexOf("-remove") != -1) {
            rl.question('Start string: ', (startString) => {
                rl.question('End string: ', (endString) => {
                    rl.question('What directory under the parent directory, if any: ', (directoryString) => {
                        if (directoryString.length == 0) {
                            directoryString = "";
                        } else {
                            if (!directoryString.startsWith("\\")) {
                                directoryString = ("\\" + directoryString);
                            }
                        }
                        removeString(settings.parentDirectoryPath, [directoryString], startString, endString);
                    });
                });
            });
        } else if (args.indexOf("-replace") != -1) {
            rl.question('What string are you replacing: ', (replaceFrom) => {
                rl.question('What string are you putting in it\'s place: ', (replaceWith) => {
                    rl.question('What directory under the parent directory, if any: ', (directoryString) => {
                        if (directoryString.length == 0) {
                            directoryString = "";
                        } else {
                            if (!directoryString.startsWith("\\")) {
                                directoryString = ("\\" + directoryString);
                            }
                        }
                        replaceString(settings.parentDirectoryPath, [directoryString], replaceFrom, replaceWith);
                    });
                });
            });
        }
    }
});