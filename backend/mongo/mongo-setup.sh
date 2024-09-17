#!/bin/bash

# Connect to MongoDB Atlas and configure replication
mongo --username root --password Quartup%2101 --authenticationDatabase admin --host mongodb://root:Quartup%2101@localhost:27017 <<EOF
rs.initiate({
_id: "rs0",
members: [
{ _id: 0, host: "localhost:27017" },
{ _id: 1, host: "solplay-almacen-api:VQj09dWKd6fItZGa@cluster0.dhhf6ha.mongodb.net/?appName=Cluster0" }
]
})
EOF
