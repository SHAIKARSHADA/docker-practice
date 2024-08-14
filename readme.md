# Docker 

## to learn in more depth go to dailycode.100xdevs.com/tracks/docker-2

#### i.e auxiliary servies means postgresql, mongodb, or database to be exact 

## what we will learn if we have learnt docker

1. Kubernetes / Container orchestration
2. Running Processes in isolated environments
3. Starting Project / auxiliary services locally


## Containerization

* Think of it like an small machine running in an big machine like mac or pc.
*  They allow you to package an application, along with all its dependencies and libraries, into a single unit that can be run on any machine with a container runtime, such as Docker.

### Why containers

* Everyone has different Operating systems
* steps to run a project can vary based on OS
* Extremely harder to keep track of dependencies as project grows

### Benefits of using containers
 
* Let you describe your configuration in a single file
* Can run in isolated environments
* Makes Local setup of OS projects a breeze
* Makes installing auxiliary services/DBs easy

## Docker Engine
Docker Engine is an open-source containerization technology that allows developers to package applications into container
Containers are standardized executable components combining application source code with the operating system (OS) libraries and dependencies required to run that code in any environment.

## Docker CLI
The command line interface lets you talk to the docker engine and lets you start/stop/list containers
> docker run -d -p 27017:27017 mongo
Docker cli is not the only way to talk to a docker engine. You can hit the docker REST API to do the same things

## Docker registry

The docker registry is how Docker makes money. 
It is similar to github, but it lets you push images rather than sourcecode
Docker’s main registry - https://dockerhub.com/
Mongo image on docker registry - https://hub.docker.com/_/mongo

## Docker Image
* A Docker image is a lightweight, standalone, executable package that includes everything needed to run a piece of software, including the code, a runtime, libraries, environment variables, and config files.
* 💡 A good mental model for an image is Your codebase on github
 
## Docker Container
* A container is a running instance of an image. It encapsulates the application or service and its dependencies, running in an isolated environment.
* 💡 A good mental model for a container is when you run node index.js on your machine from some source code you got from github

## port mapping
 ### docker run -p 27017:27017 mongo
* Port mapping is an way to describe an tell that in this localhost:27017 run the docker image of mongo
* The first one tell that mac machines this port, pls go to this port after colon

## 8 - Common docker commands
* docker images
* docker ps
* docker run
* docker build

1. docker images
Shows you all the images that you have on your machine

2. docker ps
Shows you all the containers you are running on your machine

3. docker run
Lets you start a container
-p ⇒ let’s you create a port mapping
-d. ⇒ Let’s you run it in detatched mode

4. docker build
Lets you build an image. We will see this after we understand how to create your own Dockerfile

5. docker push
Lets you push your image to a registry

6. Extra commands
docker kill
docker exec
docker rmi image-name ( to remove an docker image from your mac machine)


## What is a Dockerfile
* If you want to create an image from your own code, that you can push to dockerhub, you need to create a Dockerfile for your application.
* A Dockerfile is a text document that contains all the commands a user could call on the command line to create an image.

### How to write a dockerfile
* A dockerfile has 2 parts
1. Base image
2. Bunch of commands that you run on the base image (to install dependencies like Node.js)

## Common commands
* WORKDIR: Sets the working directory for any RUN, CMD, ENTRYPOINT, COPYinstructions that follow it.
* RUN: Executes any commands in a new layer on top of the current image and commits the results.
* CMD: Provides defaults for executing a container. There can only be one CMD instruction in a Dockerfile.
* EXPOSE: Informs Docker that the container listens on the specified network ports at runtime.
* ENV: Sets the environment variable.
* COPY: Allow files from the Docker host to be added to the Docker image

## Now that you have a dockerfile in your project, try building a docker image from it
> docker build -t image_name .

 
## Now if you try to look at your images, you should notice a new image created
> docker images

 
* 💡Add a .dockerignore so that node_modules don’t get copied over 

## Running images
> docker run -p 3000:3000 image_name

* Try visiting localhost:3000

## Passing in env variables
> docker run -p 3000:3000 -e DATABASE_URL="databaseurl connection string long thing" image_name
 
* The -e argument let’s you send in environment variables to your node.js app

## More commands
* docker kill - to kill a container
* docker exec - to exectue a command inside a container
 
1. List all contents of a container folder
> docker exec <container_name_or_id> ls /path/to/directory

2. Running an Interactive Shell
> docker exec -it <container_name_or_id> /bin/bash

in here if you want to run it interactively and use every single thing inside it then use -it or else wanna see what are the files in the just use exec and with ls, just giving an example for minimal use case.

## Layers practically
 
### Observations - 
* Base image creates the first layer
* Each RUN, COPY , WORKDIR  command creates a new layer
* Layers can get re-used across docker builds (notice CACHED in 1/6) It won't say it is cached but is cached in their

## why are we caching is because we want to reduce the build time that's why we are using caching

* so , in this two code below the first one is unoptimized and the second one is optimized

> FROM node:20
> WORKDIR usr/src/app
> COPY . .
> RUN npm install
> RUN npx prisma generate
> RUN npm run build 
> EXPOSE 3000
> CMD ["node", "dist/index.js"]

* In this first one it's unoptimized and we are using npm install after each stuff. 
* so, in the next step we are adding some layers to make it optimized.

> FROM node:20
> WORKDIR usr/src/app
> COPY package* .
> COPY ./prisma . 
> RUN npm install
> RUN npx prisma generate 
> COPY . .
> RUN npm run build 
> EXPOSE 3000
> CMD ["node","dist/index.js"]

* In the second one it is optimized, If we have existing package Then caching kicks in and executes it fast, if it has an new package then we install it and create the prisma generate and then npm i all and the rest of the code that we are gonna use . and we are running the npm run build and exposing it to listen 3000 and running commands

## Networks and Volumes

### Networks and volumes are concepts that become important when you have multiple containers running in which you
* Need to persist data across docker restarts
* Need to allow containers to talk to each other

### Containers are transitory
* If you start an container, you can store the data in them.
* If you kill an container, That data goes away. 

# Volumes
* If you restart a mongo docker container, you will notice that your data goes away. 
* This is because docker containers are transitory (they don’t retain data across restarts)

## Without volumes
### Start a mongo container locally

> docker run -p 27017:27017 -d mongo

* Open it in MongoDB Compass and add some data to it
* Kill the container
> docker kill <container_id>

* Restart the container
> docker run -p 27017:27017 -d mongo

#### Try to explore the database in Compass and check if the data has persisted (it wouldn’t)
 
## With volumes
### Create a volume

> docker volume create volume_database

* Mount the folder in mongo which actually stores the data to this volume
> docker run -v volume_database:/data/db -p 27017:27017 mongo

* Open it in MongoDB Compass and add some data to it
* Kill the container
> docker kill <container_id>

* Restart the container
> docker run -v volume_database:/data/db -p 27017:27017 mongo

#### Try to explore the database in Compass and check if the data has persisted (it will!)


# Networks 

* If you have an node.js app that has containerised mongodb 
* you can talk to it normally, but when you have the both of the node.js app and the containerised mongodb this becomes an problem in here .
* containers are dumb they don't know they have an host machine. so , we use networks between node.js container and mongodb container to make them communicate to each other.kk

* In Docker, a network is a powerful feature that allows containers to communicate with each other and with the outside world.
* Docker containers can’t talk to each other by default.
* localhost on a docker container means it's own network and not the network of the host machine

#### How to make containers talk to each other?
* Attach them to the same network

* Build the image
> docker build -t image_tag .

* Create a network
> docker network create my_custom_network

* Start the backend process with the network attached to it
> docker run -d -p 3000:3000 --name backend --network my_custom_network image_tag
* Start mongo on the same network
> docker run -d -v volume_database:/data/db --name mongo --network my_custom_network -p 27017:27017 mongo

* Check the logs to ensure the db connection is successful
> docker logs <container_id>

### Try to visit an endpoint and ensure you are able to talk to the database
### If you want, you can remove the port mapping for mongo since you don’t necessarily need it exposed on your machine

## Types of networks
### Bridge: The default network driver for containers. When you run a container without specifying a network, it's attached to a bridge network. It provides a private internal network on the host machine, and containers on the same bridge network can communicate with each other.
#### Host: Removes network isolation between the container and the Docker host, and uses the host's networking directly. This is useful for services that need to handle lots of traffic or need to expose many ports.

## compose 

* Docker Compose is a tool designed to help you define and run multi-container Docker applications. With Compose, you use a YAML file to configure your application's services, networks, and volumes. Then, with a single command, you can create and start all the services from your configuration.

### Before docker-compose
* Create a network
> docker network create my_custom_network
* Create a volume
> docker volume create volume_database
* Start mongo container
> docker run -d -v volume_database:/data/db --name mongo --network my_custom_network  mongo
* Start backend container
> docker run -d -p 3000:3000 --name backend --network my_custom_network backend
* After docker-compose
Install docker-compose - https://docs.docker.com/compose/install/
* Create a yaml file describing all your containers and volumes (by default all containers in a docker-compose run on the same network)

* Start the compose / Start command
> docker-compose up
* Stop everything (including volumes) / Stop command
> docker-compose down --volumes

* final file would look something like this in docker 
## docker-compose.yaml
>version: '3.8'
>services:
>  mongodb:
>    image: mongo
>    container_name: mongodb
>     ports:
>      - "27017:27017"
>    volumes:
>      - mongodb_data:/data/db
>
>  backend22:
>    image: backend
>    container_name: backend_app
>    depends_on:
>      - mongodb
>    ports:
>      - "3000:3000"
>    environment:
>      MONGO_URL: "mongodb://mongodb:27017"
>
>volumes:
>  mongodb_data:
