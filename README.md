## Angular-chat
Chat created with Angular, node.js, socket.io

## Start
Run **npm install** in socket-app and socket-server folders.
Change environment variable url in folder angular-chat\socket-app\src\environments from url:  'http://192.168.1.6' to 'http://your_ip_adress'.
Server: in folder angular-chat\socket-server\src run command: node app.js -a **youripaddress**
Client: in folder angular-chat\socket-app run command: ng serve --host **youripaddress**
