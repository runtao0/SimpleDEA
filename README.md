# Runtao Yang's SimpleDEA

[Live Link](http://runtaoyang.com/SimpleDEA/)

## Part 1
In the spirit of OOP, I turned csAPI into a class that contains all the information needed to make an async call. Call parameters can be passed in as JavaScript objects when instantiated. the getData() method makes the call and currys success and error callbacks into the subsequent Promise. This means that then statements can also be chained onto getData.

## Part 2
I drew inspiration from my memories of using web resources at NYU and Columbia hospitals, and represents the clearest way I would want the information organized for lab management and patient tracking. I am not sure how this data is used, but my assumptions were that users use this to keep track of DEA license renewals or for background research of a professional. I noticed that some records share the same name and NPIs but different expiration dates. Others shared the same name but different NPIs. I'm not sure exactly what this means, but assumed they were records of previous licenses or professionals that shared the same name. I accounted for these overlaps by checking for repeats in name and expiration dates.

Upon successful page load, 'exercise.js' gets the container (intended to be UL) in which the set of data will be viewed. requestID20 is an instance of csAPI and represents a call to 'https://dea.staging.credsimple.com/v1/clients_providers/20?token=3ad6aef59ee542ec881c5bc6593ba9c3'. store is an object that represents how the set of data can be processed and viewed. A call is made with getData(), and transfers the data to the store using receiveRecords(). An error message appears if the response is an error. After all the data is successfully loaded, event listeners are added to the DOM to allow a user to navigate through data on the page.

Each time a record is received, a new Professional object is instantiated, and made distinct. The store contains dictionaries that map to all the professionals for fast lookup. I included name, expiration date, and active status, but I also made it easy to add other attributes like NPI. Dictionaries can be added as objects that map to professionals, and functions to distinguish duplicates and sorting in that parameter need to be created.

The Professional class represents a professional that corresponds to a received record. It contains the the parameters to display: name and expiration, info to display in a detail view, and a reference to the corresponding DOM on the page.

Page view is managed by a Pagination class that contains an ordered array of the current subset of data and the corresponding dictionary to the sorted parameter. It also has reference to the container DOM and a page number header. Views per page, current page and total pages are tracked.

Default view is the first 30 records by expiration date. I added pagination because I thought it would be useful to see the full set of data. I also added a search by name feature since that seems like a basic parameter as well.

For styling, I chose Cabin for the Headers and Cabin for the data. This was done haphazardly based on the first combination that looked nice together. The header is organized with flex box and the data is floated. I also used animation for height transitions.
