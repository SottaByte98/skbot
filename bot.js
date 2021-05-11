//Import required modules
const fs =  require('fs');
var readline = require('readline');
const TelegramBot = require('node-telegram-bot-api')

//Insert token here
const token = '';

const bot = new TelegramBot(token, {polling: true});

//Connect bot with web
const express = require('express');
const app = express();
const port = 3000;

//Read blacklist.txt
function readf(){
    var array = fs.readFileSync('blacklist.txt', 'utf8').toString().replace(/\r\n/g,'\n').split('\n');
    return array;
}

//Responds to command "/add <word>"
bot.onText(/\/add (.+)/, (msg, match) => {
    const chat_id = msg.chat.id;
    let message_id = msg.message_id;
    bot.getChatMember(msg.chat.id, msg.from.id).then(function(data) {
		if ((data.status == "creator") || (data.status == "administrator")){
            const newword = match[1];
            
	    //Append the file (add to the last row)
            fs.appendFile('blacklist.txt', '\r\n'+newword, function (err) {
                if (err) throw err;
              });
            let arr = readf();
            bot.deleteMessage(chat_id, message_id);
            bot.sendMessage(chat_id,'added');
		}else{
            bot.deleteMessage(chat_id, message_id);
			bot.sendMessage(message.chat.id, "You are not Admin");
		}
	});
});


bot.on('message', (msg) => {
  let arr = readf();
  let chat_id = msg.chat.id;
  let message_id = msg.message_id;
  var arrayLength = arr.length;
  for (var i = 0; i < arrayLength; i++) {
	//Read the blacklist.txt files and scan for blacklisted words in messages
    if (msg.text.toLowerCase().includes(arr[i])) {
        console.log(arr[i]);
        bot.deleteMessage(chat_id, message_id);
        break;
    }
  }
}
)

app.get('/', (req, res) => res.send('sk bot is online'));
  
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
