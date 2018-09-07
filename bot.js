var Discord = require('discord.js');
var logger = require('winston');
var auth = 'NDQxMTI2MDYzNDE0OTY4MzQw.DcruPg.f2M-nBAHFVOtuXsKYtFMTfinEL0';
// Configure logger settings
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client();

bot.on('ready', ()=>  {
    console.log('I am ready');
});
bot.on('message', message => {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        
	   
        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
            break;
            // Just add any case commands if you want to..
			case 'kick':
				bot.sendMessage({
                    to: channelID,
                    message: 'Goodbye ' + args[0]
				});
			var server = message.guild;
			server.createChannel('Purge', 'voice');
				break;
         }
     }
});