/*
 * Mini project for a mailing agent to deliver parcels
 * From: https://eloquentjavascript.net/07_robot.html
 * There is a small village with a few locations. A robot must take parcels
 * to their assigned destinations.
 *
 * Gilberto Echeverria
 * 2025-01-28
 */

"use strict";

// Initial description of the connections between locations in the village
const roads = [
  "Alice's House-Bob's House",   "Alice's House-Cabin",
  "Alice's House-Post Office",   "Bob's House-Town Hall",
  "Daria's House-Ernie's House", "Daria's House-Town Hall",
  "Ernie's House-Grete's House", "Grete's House-Farm",
  "Grete's House-Shop",          "Marketplace-Farm",
  "Marketplace-Post Office",     "Marketplace-Shop",
  "Marketplace-Town Hall",       "Shop-Town Hall"
];

// Create a graph that describes the connections between destinations

function buildGraph(edges) {
    let graph = Object.create(null);

    function addEdge(from, to) {
        if (from in graph) {
            graph[from].push(to);
        } else {
            graph[from] = [to];
        }
    }

    for (let [from, to] of edges.map(s => s.split('-'))) {
        addEdge(from, to);
        addEdge(to, from);
    }

    return graph;
}

const roadGraph = buildGraph(roads);

//console.log(roadGraph);

// Classes to describe the state of the world

class VillageState {
    constructor(robotLocation, parcels) {
        // The robot's current location
        this.robotLocation = robotLocation;
        // The list of parcels to be delivered
        this.parcels = parcels;
    }

    move(location) {
        // Keep the same state if there is no road form the current position
        // to the destination
        if (!roadGraph[this.robotLocation].includes(location)) {
            return this;
        // Otherwise move the robot to the destination, and remove the
        // packages delivered from the list
        } else {
            let parcels = this.parcels.map(p => {
                if (p.origin != this.robotLocation) return p;
                return { origin: location, destination: p.destination };
            }).filter(p => p.origin != p.destination);
            return new VillageState(location, parcels);
        }
    }
}

/*

// Teting the state class

let first = new VillageState(
    "Post Office",
    [{robotLocation: "Post Office", destination: "Alice's House"}]
);
let next = first.move("Alice's House");

console.log("=== FIRST MOVE ===")
console.log(next.robotLocation);
console.log(next.parcels);
console.log(first.robotLocation);

*/

// Definition of the robot's behaviour

function runRobot(state, robot, memory) {
    for (let turn=0;;turn++) {
        if (state.parcels.length == 0) {
            //console.log(`Done in ${turn} turns`);
            return turn;
        }
        let action = robot(state, memory);
        state = state.move(action.direction);
        memory = action.memory;
        //console.log(`Moved to ${action.direction}`);
    }
}

// Delivery strategy by selecting a random direction

function randomPick(array) {
    let choice = Math.floor(Math.random() * array.length);
    return array[choice];
}

function randomRobot(state) {
    return { direction: randomPick(roadGraph[state.robotLocation]) };
}

// Add a new static method to the class definition
// This will generate some parcels to be delivered
VillageState.random = function(parcelCount = 5) {
    let parcels = [];
    for (let i=0; i<parcelCount; i++) {
        let destination = randomPick(Object.keys(roadGraph));
        let origin;
        do {
            origin = randomPick(Object.keys(roadGraph));
        } while (origin == destination);
        parcels.push({ origin, destination })
    }
    //console.log(`Parcels to deliver:`);
    //console.log(parcels);
    return new VillageState("Post Office", parcels);
}

// Test the random robot
console.log("=== RANDOM ROBOT ===");
// The 'memory' parameter is not sent since it is not used by a random robot
// // The 'memory' parameter is not sent since it is not used by a random robot
runRobot(VillageState.random(), randomRobot);

// Robot that follows a pre-defined route
const mailRoute = [
  "Alice's House", "Cabin", "Alice's House", "Bob's House",
  "Town Hall", "Daria's House", "Ernie's House",
  "Grete's House", "Shop", "Grete's House", "Farm",
  "Marketplace", "Post Office"
];

// By going from the start of the route to the end and then back again to the
// beginning, the robot could deliver every package

function routeRobot(_state, memory) {
    // Start again when reaching the end
    if(memory.length == 0) {
        memory = mailRoute;
    }
    return { direction: memory[0], memory: memory.slice(1) };
}

console.log("=== ROUTE ROBOT ===");
runRobot(VillageState.random(), routeRobot, []);


// Path finding with breadth first

function findRoute(graph, from, to) {
    let work = [{at: from, route: []}];
    for (let i=0; i<work.length; i++) {
        let {at, route} = work[i];
        for (let place of graph[at]) {
            if (place == to) return route.concat(place);
            // The 'some' method is used to identify places that have already
            // been visited. They are no longer considered
            if (!work.some(w => w.at == place)) {
                work.push({at: place, route: route.concat(place)});
            }
        }
    }
}

function goalOrientedRobot({robotLocation, parcels}, route) {
    if (route.length == 0) {
        let parcel = parcels[0];
        // If the robot is not at the parcel's origin, it needs to go
        // pick the parcel up
        if (parcel.origin != robotLocation) {
            route = findRoute(roadGraph, robotLocation, parcel.origin);
        // Otherwise, it already has the parcel and needs to deliver it to
        // the destination
        } else {
            route = findRoute(roadGraph, robotLocation, parcel.destination);
        }
    }
    return { direction: route[0], memory: route.slice(1) };
}

console.log("=== GOAL ORIENTED ROBOT ===");
runRobot(VillageState.random(), goalOrientedRobot, []);

// Improving a robot by making it select parcels that are closest

function alphaRobot({robotLocation, parcels}, route) {
    if (route.length == 0) {
        //console.log("NEW PATH EVALUATION:")
        let allRoutes;
        let parcelsHere = parcels.filter(p => p.origin == robotLocation);
        // Check if the robot is located at any parcel origin
        if (parcelsHere.length > 0) {
            //console.log(` -- Delivering a package`)
            allRoutes = parcelsHere.map(p => findRoute(roadGraph, robotLocation, p.destination))
        } else {
            //console.log(` -- Picking up a package`)
            allRoutes = parcels.map(p => findRoute(roadGraph, robotLocation, p.origin))
        }
        let lengths = allRoutes.map(r => r.length);
        //console.log(allRoutes);
        //console.log(lengths);
        // Find the shortest route
        let minLength = Math.min(...lengths);
        route = allRoutes[lengths.indexOf(minLength)];
        //console.log(`Route selected: ${route}`);
    }
    return { direction: route[0], memory: route.slice(1) };
}

console.log("=== IMPROVED ROBOT ===");
runRobot(VillageState.random(), alphaRobot, []);

// Comparing robot performance

function compareRobots(robot1, memory1, robot2, memory2) {
    let total1 = 0;
    let total2 = 0;
    const samples = 1000;
    for (let i=0; i<samples; i++) {
        const state = VillageState.random();
        total1 += runRobot(state, robot1, memory1);
        total2 += runRobot(state, robot2, memory2);
    }
    console.log(`## Average performance (${samples} samples):`);
    console.log(`- Robot1 ${total1 / samples} turns [${robot1.name}]`);
    console.log(`- Robot2 ${total2 / samples} turns [${robot2.name}]`);
}

console.log("=== ROBOT COMPARISON ===")
//compareRobots(routeRobot, [], goalOrientedRobot, []);
compareRobots(alphaRobot, [], goalOrientedRobot, []);
