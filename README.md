# BigDataFInalProject


## Introduction:
A system made up of three sub-systems which together allow near real time monitoring of ice cream flavor inventory in the branches, using a dashboard, as well as the creation of a prediction model, for a particular branch, what is going to be a profile his sales on a certain day.




## Tasks:
# The three subsystems:

** Subsystem A: Sales simulator **
An operational subsystem to be displayed by a simulator that sends messages to an intermediary with sales data

** Subsystem B: Dashboards and real-time data. **

o The subsystem will store in a Redis type database the status of each flavor
Ice cream in each of the branches.

o One of the screens will be used to request the learning of a model from subsystem C (which will prepare a data set and transfer it to BigML) Also, on the same screen it will be possible to forecast ice cream consumption in a certain branch, on a certain date for a certain ice cream flavor

**Subsystem C: Historical and background data storage subsystem responsible for the ELT process (Extract, Load, Transform)**

o The subsystem will store in a MySQL database details about the settlements and their characteristics.

o Upon arrival of a message with sales data, the current weather data will be extracted
In settlement and inquiry about a holiday in the coming week from network services, the message data and the additional data will be saved within MongoDB as a document.

o Given an instruction, the system prepares a data set, adds to each sales event the characteristics of the locality and turns to the Com.BigML service to create a decision tree-type predictive model. 



##  Run:
Download node_modules with: npm i app

remove export default m;

open terminal 1: npm run start:c

open terminal 2: npm run start:p
