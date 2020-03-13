const fs = require('fs');
var i = 0;
var csvWriter = require('csv-write-stream')
var writer = csvWriter()
let utcSeconds;
var d;
var compSec;
var completed;
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

fs.readFile('./test.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log("Error reading file from disk:", err)
        return
    }
    try {
			const customer = JSON.parse(jsonString);
			if (err) throw err;
			writer.pipe(fs.createWriteStream('All Schools.csv', {flags: 'a'}));
			for(i=0;i<customer.pendingRequests.count;i++)
			{
				utcSeconds = customer.pendingRequests.entities[i].created;
				d= new Date(utcSeconds);
				writer.write({
				"Type":"Pending",	
				"School Name":customer.pendingRequests.entities[i].institution_request.display_name,
				"Received Date":d.getDate(),
				"Received Month":monthNames[d.getMonth()],
				"Received Year":d.getFullYear(),
				"Completed Date":"NA",
				"Completed Month":"NA",
				"Country":customer.pendingRequests.entities[i].institution_request.address.country
				});
				
			}	
			for(i=0;i<customer.acceptedRequests.count;i++)
			{
				utcSeconds = customer.acceptedRequests.entities[i].created;
				d= new Date(utcSeconds);
				writer.write({
				"Type":"Accepted",	
				"School Name":customer.acceptedRequests.entities[i].institution_request.display_name,
				"Received Date":d.getDate(),
				"Received Month":monthNames[d.getMonth()],
				"Received Year":d.getFullYear(),
				"Completed Date":"NA",
				"Completed Month":"NA",
				"Country":customer.acceptedRequests.entities[i].institution_request.address.country
				});
			}
			for(i=0;i<customer.completedRequests.count;i++)
			{
				utcSeconds = customer.completedRequests.entities[i].created;
				d= new Date(utcSeconds);
				compSec = customer.completedRequests.entities[i].completed;
				completed= new Date(compSec);
				writer.write({
				"Type":"Processed",	
				"School Name":customer.completedRequests.entities[i].institution_request.display_name,
				"Received Date":d.getDate(),
				"Received Month":monthNames[d.getMonth()],
				"Received Year":d.getFullYear(),
				"Completed Date":completed.getDate(),
				"Completed Month":monthNames[completed.getMonth()],
				"Country":customer.completedRequests.entities[i].institution_request.address.country
				});
			}
			for(i=0;i<customer.revokedRequests.count;i++)
			{
				utcSeconds = customer.revokedRequests.entities[i].created;
				d= new Date(utcSeconds);
				compSec = customer.revokedRequests.entities[i].revoked;
				completed= new Date(compSec);
				writer.write({
				"Type":"Cancelled",	
				"School Name":customer.revokedRequests.entities[i].institution_request.display_name,
				"Received Date":d.getDate(),
				"Received Month":monthNames[d.getMonth()],
				"Received Year":d.getFullYear(),
				"Completed Date":completed.getDate(),
				"Completed Month":monthNames[completed.getMonth()],
				"Country":customer.revokedRequests.entities[i].institution_request.address.country
				});
			} 
				writer.end();
		} 
	catch(err) {
			console.log('Error parsing JSON string:', err)
		}
	
})