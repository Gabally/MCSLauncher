# MCSLauncher
<p align="center">
<img src="src/public/logo-high-res.png" width="200">
</p>

### A web interface made to manage and create minecraft servers automatically.

Server Setup Features:
- Create and delete server instances.
- Automatically downloads the server jar of any minecraft version.
- Automatically extracts the world from an uploaded zip file to the server's world.
- Manage the console from the web interface.
- Control the server process with the start/stop/kill commands.
- Set the minimum and maximum amount of ram a server instance can use.

### Settings
Enviroment variables will be set by the .env file if present

```MAX_RAM```(number): Maximum amount of ram you are allowed to give to a server instance.

```MIN_RAM```(number): Minimum amount of ram each server instance will use.

```APP_USERNAME```(string): The username to access the web interface

```APP_PASSWORD```(string): The password to access the web interface

```INSTANCES_PATH```(string, optional): The folder path were tge server instaces will be saved

```APP_PORT```(number, optional): The port the app will listen on (will default to 8000)

```APP_BIND```(string, optional): The address the app will listen on (will default to 127.0.0.1)
### install dependencies
```
npm install
```
### build project
```
npm run build
```
### start
```
npm run start
```
### start (development)
```
npm run start
```