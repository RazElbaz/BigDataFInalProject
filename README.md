# BigDataFInalProject

## Introduction:
A system made up of three sub-systems which together allow near real time monitoring of ice cream flavor inventory in the branches, using a dashboard, as well as the creation of a prediction model, for a particular branch, what is going to be a profile his sales on a certain day.




## Tasks:
# The three subsystems:

**Subsystem A: Sales simulator**

An operational subsystem to be displayed by a simulator that sends messages to an intermediary with sales data

**Subsystem B: Dashboards and real-time data.**

o The subsystem will store in a Redis type database the status of each flavor
Ice cream in each of the branches.

o One of the screens will be used to request the learning of a model from subsystem C (which will prepare a data set and transfer it to BigML) Also, on the same screen it will be possible to forecast ice cream consumption in a certain branch, on a certain date for a certain ice cream flavor

**Subsystem C: Historical and background data storage subsystem responsible for the ELT process (Extract, Load, Transform)**

o The subsystem will store in a MySQL database details about the settlements and their characteristics.

o Upon arrival of a message with sales data, the current weather data will be extracted
In settlement and inquiry about a holiday in the coming week from network services, the message data and the additional data will be saved within MongoDB as a document.

o Given an instruction, the system prepares a data set, adds to each sales event the characteristics of the locality and turns to the Com.BigML service to create a decision tree-type predictive model. 

Functional requirements:

1. Ice cream chain offers five flavors of ice cream: chocolate, vanilla, strawberry, lemon and halva.
2. The system will collect the branch data and their characteristics (at least 100 branches):
 
     • branch name

     • Locality

     • Owner details

     • Current stock for every ice cream flavor

3. The system will display in real time through a dashboard and full appropriate graphs of each of the flavors
In each branch (Chart Bar), the total stock of flavors in all branches (Chart Pie) and forecast
Sales of a certain branch for a certain flavor for the coming week.

4. The system will make it possible to learn from past data on the consumption of ice cream flavors and create a future consumption forecast
from the following data:

     • Day in the week

     • A month

     • Season

     • Is it a holiday week

     •The weather that day (very hot, hot, pleasant, cold, very cold)

     • Consumption level (for every taste):

      o Zero (under a kilo)

      o small (up to 20 kilos)

      o Medium (up to 60 kilos)

      o tall (up to 120 kilos)

      o very tall (over 120 kilos)

     • The size of the settlement (only eight values ​​are enough, you can group values ​​and define a scale Serial ).

     • The type of population (Jews, Arabs, mixed).
     
     • Age groups in the locality (can be translated into percentages and ranked as you wish):
     
      o toddler (ages 0-5)
      
      o Children and youth (ages 6-18)
      
      o adults (age 19-45)
      
      o adults (46-55) 
      
      o middle age (56-64)  
      
      o elderly (65 and above)

![alt text](https://github.com/RazElbaz/BigDataFInalProject/blob/main/BigData.png) 

##  Run:

Download node_modules with: **npm i app**

Enter the Dashboard server folder (with cd) and run: **node ./server.js .**

Run the producer from the dashboard folder: **npm run start:p**

Start the bigML server by entering the ELT folder and then: **node ./server.js**

Run the consumer: **node ./bigmlConsumer**


