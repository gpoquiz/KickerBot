/*
  A ping pong bot, whenever you send "ping", it replies "pong".
*/

// Import the discord.js module
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();

// The token of your bot - https://discordapp.com/developers/applications/me
const token = 'NDQxMTI2MDYzNDE0OTY4MzQw.DcruPg.f2M-nBAHFVOtuXsKYtFMTfinEL0';

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
  console.log('I am ready!');
});

// Create an event listener for messages
client.on('message', message => {
  // If the message is "ping"
  if (message.content === 'ping') {
    // Send "pong" to the same channel
    message.channel.send('pong');
  }
  if (message.content.substring(0, 1) == '!') {
        var args = message.content.substring(1).split(' ');
        var cmd = args[0];
        
		var server = message.guild;
		var channel = message.channel;
		var timer;
        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                channel.send('Pong!');
            break;
            // Just add any case commands if you want to
			case 'kick':
				var newChannel;
				var punteeName = (args[0].substring(3, args[0].length - 1));
				
				var puntee = server.members.get(punteeName);
					
					server.createChannel('Purge', 'voice').then((newChannel) => 
					{
						channel.send( 'Goodbye ' + args[0]);
						channels = server.channels.array();	
						
						puntee.setVoiceChannel(newChannel).then((puntee) =>
						{
							newChannel.delete();	
						});
					});
					
				break;
			case 'break':
				var newChannel;
				var i = 0;
				timer = setInterval(function()
					{
						if (i>=100)
						{
							clearInterval(timer);
						}
						server.createChannel('Break', 'text', 
						[{
							id: server.id,
							deny: ['READ_MESSAGES']
							
						}]).then((newChannel) => 
						{
							newChannel.send('?').then((message) =>
							{
								newChannel.delete();
								++i;
							});
						});
					}, 1000);
					break;
			case 'fix':
				clearInterval(timer);
                channel.send('Pong!');
				break;
				
         }
     }
});

// Log our bot in
client.login(token);