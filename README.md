**TranslaBserver**

This is a site that keeps track of my work as an anime series translator. This was made to learn the cloud technologies, but it will be available in previous commits as a standalone application.

------------
How to connect to the EC2 instance and deploy your web server:
1. Login to your AWS account, search for EC2 and press „Launch Instance”
2. Choose an operating system, create a security key(.pem file) and check „Allow HTTP traffic from the internet.” + „Allow HTTPS traffic from the internet.”
3. Connect to the instance via SSH.
4. In the instance run the following commands:

   
   Fetch the latest updates:
   
   ```sudo dnf update```

   Install Nginx web server:
   
   ```sudo dnf install nginx -y```

   Start and enable Nginx web server so it starts every time the instance is boot:
   
   ```sudo systemctl start nginxed```
   
   ```sudo systemctl enable nginx```
   
   Install and check if node.js was installed properlly:

   ```sudo dnf install -y nodejs```
   
   ```node -v```
   
   ```npm -v```

   Bring the project with git clone into a new folder created in /home. Inside the folder run:

   ```npm install```
   
   and
   
   ```npm run devStart```
   
------------
Good to know links:

1. How to install MongoDB on your computer:
   https://www.youtube.com/watch?v=jvaBaxlTqU8
