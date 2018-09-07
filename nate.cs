using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Crap;
using Discord;
using Discord.WebSocket;
using DiscordPleaseStopSendingMessages.Properties;
using Microsoft.EntityFrameworkCore;
using ConTabs;
namespace DiscordPleaseStopSendingMessages
{
    class Program
    {


        public static void Main(string[] args)
        {
            MainAlternative().GetAwaiter().GetResult();

        }

        static DiscordSocketClient client;
        public static async Task MainAlternative()
        {
            client = new DiscordSocketClient();
            client.Log += Log;
            client.MessageReceived += MessageReceived;
            
            string token = Resources.Token;


            await client.LoginAsync(TokenType.Bot, token);
            await client.StartAsync();


            await Task.Delay(-1);

        }

        static async Task MessageReceived(SocketMessage message)
        {

            if (!message.Channel.Name.ToLower().Contains("music"))
            {
                if (message.Content.StartsWith("?"))
                {
                    if (message.Content.ToLower().StartsWith("?mostautistic"))
                    {
                        await Log("Sending leaderboard");
                        await SendLeaderboard(message);
                        return;
                    }
                    if (message.Content.ToLower().StartsWith("?update"))
                    {
                        using (var db = new UsersContext())
                        {
                            await SetHighScore(db);
                        }
                        return;
                    }
                    if (message.Content.ToLower().StartsWith("?/kick"))
                    {
                        if (message.MentionedUsers.Count != 0)
                        {
                            await PuntUser(message.MentionedUsers.First() as SocketGuildUser);
                        }
                        return;
                    }
                    
                    await Log(new LogMessage(LogSeverity.Info, "Spam", "New spam detected"));
                    using (var db = new UsersContext())
                    {

                        var actualUser = await db.Users
                            .Where(s=>s.User == (decimal)message.Author.Id)
                            .FirstOrDefaultAsync(s => s.User == message.Author.Id);

                        if (actualUser == null)
                        {
                            await Log(new LogMessage(LogSeverity.Info, "Spam",
                                $"{message.Author.Username} is a new offender."));
                            db.Users.Add(new MyUser(message.Author.Id, 1) {Username = message.Author.Username});
                            await message.Channel.SendMessageAsync(
                                $"{message.Author.Mention}, please use the music-commands channel for music commands.  This is the first time you have made this mistake.");
                        }
                        else
                        {
                            actualUser.Count += 1;
                            await Log(new LogMessage(LogSeverity.Info, "Spam",
                                $"{message.Author.Username} is a repeat offender ${actualUser.Count} times."));
                            await message.Channel.SendMessageAsync(
                                $"{message.Author.Mention}, please use the music-commands channel for music commands.  You have made this mistake {actualUser.Count } times.");
                        }
                        await PuntUser(message);

                        await SetHighScore(db);

                        await db.SaveChangesAsync();
                    }
                }
            }
            
        }

        private static async Task PuntUser(SocketMessage message)
        {
            var chanel = message.Channel as SocketGuildChannel;
            var guild = chanel.Guild;
            var puntChanel = await guild.CreateVoiceChannelAsync("Punt");
            var guildUser = message.Author as SocketGuildUser;
            await guildUser.ModifyAsync((x) => { x.Channel = puntChanel; });
            await puntChanel.DeleteAsync();
        }

        private static async Task PuntUser(SocketGuildUser user)
        {
            var guild = user.Guild;
            var puntChanel = await guild.CreateVoiceChannelAsync("Punt");
            await user.ModifyAsync((x) => { x.Channel = puntChanel; });
            await puntChanel.DeleteAsync();
        }

        private static async Task SendLeaderboard(SocketMessage message)
        {
            using (var db = new UsersContext())
            {

                var topFive = await db.Users
                    .OrderByDescending(i => i.Count)
                    .Take(5)
                    .ToArrayAsync();
                var table = Table<MyUser>.Create(topFive);
                table.Columns["UserDatabaseId"].Hide = true;
                table.Columns["User"].Hide = true;
                table.Columns.MoveColumn("Username",0);

                Console.WriteLine(table.ToString());
                await message.Channel.SendMessageAsync("```\n" + table.ToString() + "\n```");

            }
            
        }

        private static async Task SetHighScore(UsersContext db)
        {
            MyUser highestUser = await db.Users
                .OrderByDescending(i => i.Count)
                .FirstOrDefaultAsync();
            if (highestUser != null)
            {
                await client.SetGameAsync($"{highestUser.Username} : {highestUser.Count}");
            }
        }

        static Task Log(LogMessage log)
        {
            Console.WriteLine(log);
            return Task.CompletedTask;
        }

        static Task Log(string content, string title = "Spam")
        {
            return Log(new LogMessage(LogSeverity.Info, title, content));
        }

    }

    
}

namespace Crap
{
    public class UsersContext : DbContext
    {
        
        public UsersContext()
        {

        }

        protected override void OnConfiguring(DbContextOptionsBuilder builder)
        {
            string remoteUser = Resources.remoteUser;
            string remotePass = Resources.remotePass;

            builder.UseMySQL(
                $@"Server=bot.nate601.me;Database=complaintDatabase;Uid={remoteUser};Pwd={remotePass};");
        }


        public DbSet<MyUser> Users { get; set; }

    }

    public class MyUser
    {
        public MyUser(decimal user, int count)
        {
            User = user;
            Count = count;
        }

        public MyUser()
        {
            
        }
        [Key]
        public int UserDatabaseId { get; set; }
        public decimal User { get; set; }
        public int Count { get; set; }
        public string Username { get; set; }
    }
}