import discord
from discord.ext import commands
import httpx  # Import httpx for sending HTTP requests
import asyncio
import socket
import json

# Replace 'YOUR_BOT_TOKEN_HERE' with your actual bot token
TOKEN = 'TOKEN'
CHANNEL_ID = 'CHANNEL_ID'  # Replace with your Discord channel ID

# Define intents
intents = discord.Intents.default()
intents.message_content = True  # Enable message content intent

# Set up the bot
bot = commands.Bot(command_prefix='!', intents=intents)

@bot.event
async def on_ready():
    await bot.tree.sync()
    print(f'{bot.user} has connected to Discord and slash commands are ready!')
   
    # Run the socket server in the background
    bot.loop.create_task(run_socket_server())
# Define the 'jobbot' slash command
@bot.tree.command(name="jobbot", description="Create a new job post")
async def jobbot(interaction: discord.Interaction):
    # Create a modal for the job application
    class JobModal(discord.ui.Modal, title="Job Posting"):
        # Define input fields for the modal
        name = discord.ui.TextInput(label="Job Name", placeholder="Enter job name", required=True)
        description = discord.ui.TextInput(label="Description", style=discord.TextStyle.long, placeholder="Enter job description", required=True)
        price = discord.ui.TextInput(label="Price", placeholder="Enter job price", required=True)
        token = discord.ui.TextInput(label="Token", placeholder="Enter token (e.g., COMAI, TAO, ETH)", required=True)

        # The callback function for when the modal is submitted
        async def on_submit(self, interaction: discord.Interaction):
            # Collect information from the modal inputs
            job_name = self.name.value
            job_description = self.description.value
            job_price = self.price.value
            job_token = self.token.value
            job_githubLink = self.githubLink.value

            # Send the collected data to the backend
            project_data = {
                "title": job_name,
                "description": job_description,
                "price": job_price,
                "token": job_token,
                "githubLink": job_githubLink,
                "liveDemo": '',
                "status": 'To Do',
                "reviewRequire": False,
                "developers": [],
                "stars": [],
                "likes": [],
                "disLikes": [],
                "pms": [],
                "avatar": ''
            }

            try:
                async with httpx.AsyncClient() as client:
                    response = await client.post("http://localhost:5000/api/v1/project/newProject", json=project_data)
                    if response.status_code == 200:
                        print("Data sent successfully to the backend.")
                    else:
                        print(f"Failed to send data. Status code: {response.status_code}")
                        print(f"Response: {response.text}")

            except httpx.HTTPError as e:
                print(f"An error occurred while sending data: {e}")

            # Create an embed to display job details
            embed = discord.Embed(title="New Job Posting", color=discord.Color.green())
            embed.add_field(name="Job Name", value=job_name, inline=False)
            embed.add_field(name="Description", value=job_description, inline=False)
            embed.add_field(name="Price", value=job_price, inline=True)
            embed.add_field(name="Token", value=job_token, inline=True)

            # Add an "Apply" button for users to apply to the job
            view = discord.ui.View()
            apply_button = discord.ui.Button(label="Apply", style=discord.ButtonStyle.link, url="http://localhost:3000/")

            async def apply_callback(button_interaction):
                await button_interaction.response.send_message(f"{button_interaction.user.name} has applied for the job '{job_name}'!", ephemeral=True)

            apply_button.callback = apply_callback
            view.add_item(apply_button)

            # Send the embed with the job details to the channel
            await interaction.response.send_message(embed=embed, view=view)

    # Show the modal to the user
    await interaction.response.send_modal(JobModal())

async def run_socket_server():
    server = await asyncio.start_server(handle_connection, '127.0.0.1', 65432)
    print("Socket server started and listening for connections...")

    async with server:
        await server.serve_forever()

async def handle_connection(reader, writer):
    data = await reader.read(1000)  # Adjust buffer size as needed
    message = data.decode()
    print(f"Received data: {message}")

    try:
        # Parse the received JSON data
        project_data = json.loads(message)
        
        # Extract data for the embed
        title = project_data.get("title", "N/A")
        description = project_data.get("description", "N/A")
        price = project_data.get("price", "N/A")
        token = project_data.get("token", "N/A")

        # Create a Discord embed
        embed = discord.Embed(title="New Project Details", color=discord.Color.blue())
        embed.add_field(name="Title", value=title, inline=False)
        embed.add_field(name="Description", value=description, inline=False)
        embed.add_field(name="Price", value=price, inline=True)
        embed.add_field(name="Token", value=token, inline=True)

        # Create a button with a link
        class ApplyButton(discord.ui.View):
            def __init__(self):
                super().__init__()
                self.add_item(discord.ui.Button(label="Apply", url="http://localhost:3000/"))

        # Send the embed and the button to the specified channel
        channel = bot.get_channel(CHANNEL_ID)
        if channel:
            await channel.send(embed=embed, view=ApplyButton())

    except json.JSONDecodeError:
        print("Failed to decode JSON data.")
        channel = bot.get_channel(CHANNEL_ID)
        if channel:
            await channel.send("Received invalid project data format.")
    
    writer.close()
    await writer.wait_closed()

# Run bot
bot.run(TOKEN)
