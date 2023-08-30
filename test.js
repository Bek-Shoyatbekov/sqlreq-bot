const axios = require("axios");
const fs = require("fs");
const path = require("path");
const pipe = require("pipe");
const excelToJson = require('convert-excel-to-json');
const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '5987363353:AAG2nb9H91TanTEnKefm8HxTBNyANAg51hQ';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
});



const phoneValidator =  (phone) => {
    // write a regex to validate phone number, phone number should be 12 digits, and should start with 998
    const regex = /^998[0-9]{9}$/;
    return regex.test(phone);
}
const arrayChecker = (arr) => {
    // write a function that checks if more than half of the array is valid phone numbers
    // if yes, return true
    // if no, return false
    let count = 0;
    let results = [];
    arr.forEach(item => {
        if (phoneValidator(item)) {
            count++;
            results.push(`'${item}'`);
        }
    });
    if (count > arr.length / 2) {
        return results;
    }
    return false;
}
const req1 = (numbers) => {
    let res = `update distr_list_subscribers set status = 1,edit_date=now() where status = 0 and msisdn in (${numbers});

    update scheduled_subscribers set status = 1 where status = 0 and msisdn in (${numbers});
    
    -- --Отключение погоды.
    update distr_weather_subscribers set status = 1,edit_date=now() where status = 0 and msisdn in (${numbers});
    
    --Отключение гороскоп.
    update horoscope_register_5454 set status =1,edit_date=now() where status = 0 and msisdn in (${numbers});
    -- --Biznes horo
    update horoscope_bisnes_register set status =1,edit_date=now() where status = 0 and msisdn in (${numbers});
    --Description mun
    update horoscope_description_register set status =1,edit_date=now() where status = 0 and msisdn in (${numbers});
    --Отключение Muchal.
    update muchal_subscribers set status =1,edit_date=current_date  where status = 0 and msisdn in (${numbers});
    --Отключение Севги гороскоп.
    update horoscope_sevgi_register_5454 set status =1,edit_date=now() where status = 0 and msisdn in (${numbers});
    --Anons/
    update anons_subscription set status =0 where status = 1 AND msisdn in (${numbers});
    
    update ivr_remember_msisdn  set status = 1,edit_date=now() where status = 0 and  msisdn in (${numbers});
    
    --Imena
    update names_subscribers_5454 set status = 1 where status = 0 and msisdn in (${numbers});
    --kelin kuyov
    update kelin_kuyov set status = 1 where status = 0 and  msisdn in (${numbers});
    
    update bio_rhythm  set status = 1, edit_date=current_timestamp where status = 0 and msisdn in (${numbers});
    
    
    
    
    
    
    -- select * from in_sms WHERE body like 'AA %' ORDER BY create_date DESC LIMIT 1 
    -- 
    -- SELECT * FROM out_sms WHERE msisdn='998988887798' ORDER BY create_date DESC
    --`;
    return res;
}
const req2 = (numbers) => {
    let res = `SELECT COUNT(*) FROM  distr_list_subscribers  where status = 0 and msisdn in (${numbers});


    SELECT COUNT(*) FROM  scheduled_subscribers  where status = 0 and msisdn in (${numbers});
    -- 
    -- --Отключение погоды.
    SELECT COUNT(*) FROM  distr_weather_subscribers  where status = 0 and msisdn in (${numbers});
    --  
    -- --Отключение гороскоп.
    SELECT COUNT(*) FROM  horoscope_register_5454  where status = 0 and msisdn in (${numbers});
    -- --Biznes horo
    SELECT COUNT(*) FROM  horoscope_bisnes_register  where status = 0 and msisdn in (${numbers});
    -- --Description mun
    SELECT COUNT(*) FROM  horoscope_description_register  where status = 0 and msisdn in (${numbers});
    -- --Отключение Muchal.
    SELECT COUNT(*) FROM  muchal_subscribers where status = 0 and msisdn in (${numbers});
    -- --Отключение Севги гороскоп.
    SELECT COUNT(*) FROM  horoscope_sevgi_register_5454 where status = 0 and msisdn in (${numbers});
    -- --Anons
    SELECT COUNT(*) FROM  anons_subscription where status = 1 AND msisdn in (${numbers});
    -- 
    SELECT COUNT(*) FROM  ivr_remember_msisdn where status = 0 and  msisdn in (${numbers});
    -- 
    -- --Imena
    SELECT COUNT(*) FROM  names_subscribers_5454  where status = 0 and msisdn in (${numbers});
    -- --kelin kuyov
    SELECT COUNT(*) FROM  kelin_kuyov where status = 0 and  msisdn in (${numbers});
    -- 
    SELECT COUNT(*) FROM  bio_rhythm where status = 0 and msisdn in (${numbers});`;
    return res;
}

// axios.get(ittimeURL)
//     .then(response => {
//         const data = response.data;
//         let txtToWrite = "";
//         data.forEach(blogData => {
//             txtToWrite += `${blogData.tags} || ${blogData.id} ||${blogData.title} \n`;
//         });
//         fs.writeFile(path.join("ittime.txt"), txtToWrite, (err) => {
//             if (err) {
//                 return console.log(err);
//             }
//         }
//     )
//     })
//     .catch(err => console.log(err));


function allInOne(urlOfxls){
    let the_row = 'A';
    const result = excelToJson({
        sourceFile: urlOfxls,
    });
    const validTable = result[Object.keys(result)[0]];
    let current_row = validTable.map(item => item[the_row]);
    let validNumbers = [];
    let invalidNumbers = [];
    let validNumbersCount = 0;
    if(arrayChecker(current_row)){
        validNumbers = arrayChecker(current_row);
    } else {
        the_row = 'B';
        current_row = validTable.map(item => item[the_row]);
        if(arrayChecker(current_row)){
            validNumbers = arrayChecker(current_row);
        } else {
            the_row = 'C';
            current_row = validTable.map(item => item[the_row]);
            if(arrayChecker(current_row)){
                validNumbers = arrayChecker(current_row);
            } else {
                validNumbers = [];
            }
        }
    }
    validNumbersCount = validNumbers.length;
    return {
        validNumbers,
        invalidNumbers,
        validNumbersCount
    };
}
let numsToSQL = [];
let howManyValidEach = [];
let countValid = 0;
let filenames = [];
bot.on('document', (msg) => {
    const chatId = msg.chat.id;
    // get file and save it
    bot.getFile(msg.document.file_id).then(file => {
        console.log(file);
        const fileURL = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
        axios.get(fileURL, {responseType: 'stream'})
            .then(response => {
                response.data.pipe(fs
                    .createWriteStream(path.join(__dirname, "files", msg.document.file_name))
                    .on('finish', () => {
                        const result = allInOne(path.join(__dirname, "files", msg.document.file_name));
                        filenames.push(msg.document.file_name);
                        numsToSQL = numsToSQL.concat(result.validNumbers);
                        countValid += result.validNumbersCount;
                        howManyValidEach.push(`${msg.document.file_name}: ${result.validNumbersCount}`);
                        bot.sendMessage(chatId, `${howManyValidEach.join("\n")}\n\n\nValid numbers (${countValid})`,
                            {
                                parse_mode: "HTML",
                                reply_markup: {
                                    inline_keyboard: [
                                        [
                                            {
                                                text: "SQL so'rovini olish",
                                                callback_data: "delete_services"
                                            }
                                        ]
                                    ]
                                }
                            }
                        );
                    })
                );
            })
        })
});

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    if (query.data === "delete_services") {
        // send numsToSQL to req1
        // then send result to user as a txt file
        let sql1 = req1(numsToSQL);
        let sql2 = req2(numsToSQL);
        console.log(numsToSQL.length);

        fs.writeFile(path.join(__dirname, "files", `sql1_${new Date().getDate()}-${new Date().getMonth()}.txt`), sql1, (err) => {
            if (err) {
                return console.log(err);
            }
        });
        fs.writeFile(path.join(__dirname, "files", `sql2_${new Date().getDate()}-${new Date().getMonth()}.txt`),sql2, (err) => {
            if (err) {
                return console.log(err);
            }
        });
        bot.sendDocument(chatId, path.join(__dirname, "files", `sql1_${new Date().getDate()}-${new Date().getMonth()}.txt`))
        .then(()=>{
            bot.sendDocument(chatId, path.join(__dirname, "files", `sql2_${new Date().getDate()}-${new Date().getMonth()}.txt`))
            .then(() => {
                filenames.push(`sql1_${new Date().getDate()}-${new Date().getMonth()}.txt`);
                filenames.push(`sql2_${new Date().getDate()}-${new Date().getMonth()}.txt`);
                filenames.forEach(filename => {
                fs.unlink(path.join(__dirname, "files", filename), (err) => {
                        if (err) {
                            console.log(err);
                        }
                    }
                )
                });
                filenames = [];
                numsToSQL = [];
                howManyValidEach = [];
                countValid = 0;
            });
        })
        // delete all files
        
        
    }
});