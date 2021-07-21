const readline = require('readline');
const fs = require('fs');
const { startup } = require('./startup');
const { readFile, readDirectory, writeFile } = require('./files');
let settings = require('./fesettings.json');
const { search } = require('./search');

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
            rl.question('What directory under the parent directory, if any? (n for no directory): ', (answer2) => {
                if (answer2.toLowerCase() == "n") {
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
});