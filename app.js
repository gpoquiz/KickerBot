/*
  A ping pong bot, whenever you send "ping", it replies "pong".
*/

// Import the discord.js module
const Discord = require('discord.js');
const config = require('./config.json');

// Create an instance of a Discord client
const client = new Discord.Client();

// The token of your bot - https://discordapp.com/developers/applications/me
// Log our bot in
client.login(config.token);

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
  console.log('I am ready!');
});

// Create an event listener for messages
client.on('message',async message => {
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
				var punteeName = (args[0].substring(args[0].length - 19, args[0].length - 1));
				var puntee = server.members.get(punteeName);
				//	channel.send("" + args[0].substring(3, args[0].length - 1));
					channel.send( 'Goodbye ' + args[0]);
					server.createChannel('Purge', 'voice').then((newChannel) => 
					{
						
							puntee.setVoiceChannel(newChannel).then((puntee) =>
							{
								channels = server.channels.array();
								newChannel.delete().catch(O_o=>{}); 	
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
			case 'narwhal':
				var newChannel;
				var punteeName = (args[0].substring(args[0].length - 19, args[0].length - 1));
				var puntee = server.members.get(punteeName);
					channel.send( 'I have a song for you ' + args[0]);
					
					channel.send( '?stop').then((message) =>
					{
						channel.send( '?play https://www.youtube.com/watch?v=GcYVCvBq0FY').then((message) =>
						{
							
						});
					});
					
				break;
				
			case 'mock':
				var newChannel;
				var punteeName = (args[0].substring(args[0].length - 19, args[0].length - 1));
				var puntee = server.members.get(punteeName);
				//	channel.send("" + args[0].substring(3, args[0].length - 1));
				
				var lastMsg = puntee.lastMessage.content;
				var newMsg = '';
				for (var i = 0; i < lastMsg.length; i++)
				{
					newMsg += (i&1) ? (lastMsg.charAt(i).toUpperCase()) : (lastMsg.charAt(i).toLowerCase())
				}
				channel.send(newMsg);
					
				break;
			case 'thisissosad':
				voiceChannel = message.member.voiceChannel;
				voiceChannel.join()
				.then(connection => 
				{
					console.log('Connected!')
				const dispatcher = connection.playFile('Despacito.mp3');
				dispatcher.setVolume(0.1) 
				dispatcher.on('finish', () => {
				  console.log('Finished playing!');
					});
				})
				.catch(console.error);;

				break;
			case 'join':
				voiceChannel = message.member.voiceChannel;
				voiceChannel.join()
				.then(connection => console.log('Connected!'))
				.catch(console.error);
				break;

			
				
				
         }
     }
});
