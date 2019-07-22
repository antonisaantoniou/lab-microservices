# Description
## Part A
You are required to develop 3 microservices (using either NodeJs or Python) for a fictions Fleet Management System (FMS) as follows:
- *Microservice_A*: Exposes an HTTP Restful API, that allows performing CRUD operations for the management of Fleet entities (i.e: Driver, Car, Trip, etc). Also provides endpoints for assigning a Driver to a Car
- *Microservice_B*: Simulates a Car that is driven about a city. This microservice generates heartbeats on frequent time intervals that encapsulate the state of the car (car_id, geo-coordinates, speed, etc) and driver identity.
- *Microservice_C*: Consumes heartbeats in order to apply penalty points to drivers that are not driving in a behaved manner. 1 Penalty point is added for every Km over 60Km/h, 2 points for over 80Km/h, 5 points for over 100Km/h. Driver/Penalty point map is stored in a NoSQL store and exposed via an HTTP API
- Microservices should communicate among them using a RabbitMQ service bus. You should define the message exchange protocol and explain your design decisions

- Implementation of the above services should be provided in a pull-request to this GitHub repo
- Pull-request must include a Docker-Compose YML that allows running the whole stack
- Pull-request must include a README for any explanation points

### Part A - Comments

- *Run services*: 

    `` cd <project dir>``

    `` docker-compose build``
    
    `` docker-compose up``
    
    Now the three services, Mongo db docker and Rabbit Mq servers are going to run
    
    Warning: if you see any errors after docker-compose up command is normal. The services are waiting to connect to
    rabbit mq and mongo db. Wait until all services start to work normally.

- *Examples of apis usage*:

   - You can import the files under ./postman_apis_json_files for the apis usage and examples

    
- *Why AMQP message protocol*: 

    Like any messaging system, AMQP deals with publishers and consumers. For our services publisher
    is the Microservice_A (apisServer) and Microservice_B (carSimulationServer), each service for a different queue. Microservice_A is 
    is publishing when a driver was assigned to a car and started to move or when a driver is removed
    from a car, hence the car is stopped. Microservice_B is publishing to another queue when a random 
    car status is created.
    
    Furthermore, Microservice B and C (penaltyServer) are consumers. Microservice_B consumes messages from the queue that
    the Microservice_A publish a message, so it can starts to create random car status data or stop random 
    data based on the messages status. Finally, Microservice_C consumes data from the queue that Microservice_B
    publish messages and calculates the penalty points. 
    

- *What I could do better*:
   
    - More tests
    - Security for the apis
    - Add a pug view that shows the random data on a map 
    
- *User-stories, where OPA can be a good fit for the fictious FMS*:

    - As an admin user I need to block a user or a group of users that do not have access 
      to specific apis. (API authorization)
    - As an admin user I need to block a user from requesting more than x number of requests
      per minute.
    - As an admin user I need block on which hosts can a container be deployed on.
    - As an admin user I need to define which protocols can be used on each server.
    - As an admin user I need server can be attached to public networks.

- *What is the benefit of the Open Policy Agent?*:

    Using OPA, you can offload policy decisions from a service such as max requests
    for a user, if an api call is allowed for the specific user, on which hosts can a container
    be deployed on and what updates must be applied for a resource. As a conclusion, you do not
    need to be worry about security policies in the service that you create but you can write 
    policies using OPA and let OPA to decide if a request can be served or not.
    
- *Where could OPA potentially reside in the FMS architecture?*:

    OPA, can reside on a new docker container and for each api request the api server (Microservice_A)
    will need to check if the user has access to the api based on a token or a session id using 
    the OPA service. Check example of Microservice_A ( app.ts ) that I am using OPA on app.use
    to check if a dummy user has access to delete, update and create any of the models available. I used the
    dummy user as an example of how we can implement policy rules and control the access of the users.
    For more complicated implementation we can use token for OPA access control. I have left the basic 
    implementation that it continues if user not given through a query parameter.
    
    - *OPA basic access control*: 
    
        - Only an admin can delete an entity
        - An employee can only remove a driver from a car
        - All the other operations are allowed for both employees and admins 
    
    
    

## Part B
- Familiarize with the [Open Policy Agent (OPA)](https://www.openpolicyagent.org/)
- Extend the README in Part A in order to:
- - provide your own thoughts (i.e. user-stories), where OPA can be a good fit for the fictious FMS in Part A
- - what is the benefit of OPA
- - where could OPA potentially reside in the FMS architecture?

# Bonus
- Provide a simple implementation that extends the FMS services and makes use of OPA
- You can use one of the concepts provided in Part B
