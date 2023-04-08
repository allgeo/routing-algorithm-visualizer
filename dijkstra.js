class GraphAdjacencyList {
    constructor() {
        this.nodes = new Map();
    }

    addNode(node) {
        if (!this.nodes.has(node)) {
            this.nodes.set(node, []);
        }
    }

    addEdge(node1, node2, weight) {
        if (this.nodes.has(node1) && this.nodes.has(node2)) {
            this.nodes.get(node1).push({ node: node2, weight: weight });
            this.nodes.get(node2).push({ node: node1, weight: weight });
        }
    }

    // Print the graph in adjacency list format for visualization in console
    printGraph() {
        for (const [node, edges] of this.nodes.entries()) {
            const connections = edges
                .map((edge) => `${edge.node}(${edge.weight})`)
                .join(", ");
            console.log(`${node} -> ${connections}`);
        }
    }

}

function dijkstra(graph, startNode, endNode){
    //Sets for visited nodes and unvisited nodes 
    const visited = new Set();
    const unvisited = new Set(graph.nodes.keys());
    //Map to keep track of predecessor node and and one for distances
    const predecessor = new Map();
    const distances = new Map();

    //Initialize all node distances to startNode as infinite except startNode which is 0 
    for (const node of unvisited) {
        distances.set(node, Infinity);
    }
    distances.set(startNode, 0);

    createDijkstraTable(graph, visited, unvisited, predecessor, distances);

    //arrays used to keep track of changes in distance, predecessors, visted and unvisted nodes as algorithm progresses
    let visitedUpdates = []
    let unvisitedUpdates = []
    let predecessorUpdates = []
    let distancesUpdates = []
    let minNodesUpdates = []

    //Loop through unvisited nodes finding node with least distance to previous node 
    while(unvisited.size > 0){
        let minNode = null; 
        let minDist = Infinity;
        for (const node of unvisited){
            if (distances.get(node) < minDist){
                minDist = distances.get(node);
                minNode = node;    
            }
        }
        
      
        //Add node with least distance to previous node to visited and remove from unvisited
        visited.add(minNode);
        unvisited.delete(minNode);

        minNodesUpdates.push(minNode);
        visitedUpdates.push(createSetCopy(visited));
        unvisitedUpdates.push(createSetCopy(unvisited));
        distancesUpdates.push(createMapCopy(distances));
        predecessorUpdates.push(createMapCopy(predecessor));
        //Unvisited neighbour nodes of current visited node 
        let neighbours = graph.nodes.get(minNode);
        //Loop through unvisited neighbor nodes 
        for(let neighbour of neighbours){
            if(!visited.has(neighbour.node)){
                //Calculate distance to from current visited node to neighbour node 
                let distToNeighbour = distances.get(minNode) + neighbour.weight;
                //Update distance to neighbour node if new distance is shorter than distance to current 
                if (distToNeighbour < distances.get(neighbour.node)){
                    distances.set(neighbour.node, distToNeighbour);
                    //Update predecessor node as distance to neighbour updates
                    predecessor.set(neighbour.node, minNode);
                } 
            }
        }

        distancesUpdates.push(createMapCopy(distances));
    }
    
    let timeout = 0;
    
    for(let i=0; i<minNodesUpdates.length; i++) {
        setTimeout(() => {
            document.getElementById("dijkstraAnnotation").innerHTML = (`Unvisted node with smallest distance is ${minNodesUpdates[i]}`)
            updateDijkstraTable(graph, visitedUpdates[i], unvisitedUpdates[i], predecessorUpdates[i], distancesUpdates[i+i])
        }, timeout)

        setTimeout(() => {
            document.getElementById("dijkstraAnnotation").innerHTML = (`Then for each univisited neighbour of ${minNodesUpdates[i]}, if the cost of traversing from ${startNode} to each neighbour through ${minNodesUpdates[i]} is less than the current distance to each neighbour, then the shortest distance is updated.`)
            updateDijkstraTable(graph, visitedUpdates[i], unvisitedUpdates[i], predecessorUpdates[i], distancesUpdates[i+i+1])
        }, timeout + 3000)

        timeout += 13000
    }

    setTimeout(() => {
        document.getElementById("dijkstraAnnotation").innerHTML = `Now that all nodes have been visted we can stop and the shortest distance from ${startNode} to all other nodes can been seen in the table.`
    }, timeout - 3000);

    
    
    //Build shortest path from start node to end node from map of predecessor nodes
    const path = [];
    let current = endNode;
    while(predecessor.has(current)){
        path.unshift(current);
        current = predecessor.get(current);
    }
    path.unshift(startNode);


    //Return path and distance
    return {shortestDistToAllNodes: distances, predecessor, pathFromStartNodeToEndNode: path, distFromStartNodeToEndNode: distances.get(endNode) };
}

//NOT DONE
function runDijkstra() {

    const graph = new GraphAdjacencyList();

    //loop through nodes and add them to new graph
    cy.nodes().forEach(function (ele) {
        graph.addNode(ele.id());
    });
    //loop through edges and add them to graph
    cy.edges().forEach(function (ele) {
        graph.addEdge(
            ele.source().id(),
            ele.target().id(),
            parseInt(ele.data("weight"))
        );
    });

    initializeDijkstraAnnotations();

    const result = dijkstra(graph, "n0", "n11");
    const shortestPathNodes = result.pathFromStartNodeToEndNode;
    //console.log(result)

    return shortestPathNodes;// Should ideally return [ 'n0', 'n1', 'n2', 'n7', 'n8', 'n11' ] (shortest path from n0 to n11)
}

window.addEventListener("load", (event) => {
    //assignDropDown(); //dynamically fill DV dropboxes
    getStoredWeight(); //get stored values for the weight boxes
    runDijkstra();
  });


function createSetCopy(set) {
    let copy = new Set();
    for(let item of set) {
        copy.add(item);
    }

    return copy;
}


//fuction used to create deep copy distance and predecessor maps
function createMapCopy(map) {
    let copy = new Map();

    for(let key of map.keys()) {
        copy.set(key, map.get(key))
    }

    return copy;
}

function initializeDijkstraAnnotations(){
    if(document.getElementById("dijkstraAnnotation")) {
        let element = document.getElementById("dijkstraAnnotation");
        element.innerHTML = "";
    } 

    if(document.getElementById("dijkstraDisTableContainer")) {
        let element = document.getElementById("dijkstraDisTableContainer");
        element.innerHTML = "";
    }

    let annotationsContainer = document.getElementById("algoAnnotationsContainer");
    //create annotation to explain what is going on at each step of dijksta algo
    let dijkstraAnnotation = document.createElement("h5");
    dijkstraAnnotation.setAttribute("id", "dijkstraAnnotation");
    dijkstraAnnotation.innerHTML = "";
    annotationsContainer.appendChild(dijkstraAnnotation);

    //create container for distance table for dijkstra algo
    let dijktraDistTableContainer = document.createElement("div");
    dijktraDistTableContainer.setAttribute("id", "dijkstraDisTableContainer");
    annotationsContainer.appendChild(dijktraDistTableContainer);

}

function createDijkstraTable(graph, visted, unvisited, predecessors, distances) {
    let container = document.getElementById("dijkstraDisTableContainer");
    let table = document.createElement("table");
    table.classList.add("table", "table-bordered", "table-striped");
    table.setAttribute("id", "dijkstraDistTable")

    //create table header
    let tableHeader = document.createElement("thead")
    tableHeader.classList.add("table-dark");
    let tableHeaderRow = document.createElement("tr");
    
    let vertexHeader = document.createElement("th")
    vertexHeader.innerHTML = "Vertex";

    let vistedHeader =document.createElement("th");
    vistedHeader.innerHTML ="Visted";

    let distanceHeader = document.createElement("th");
    distanceHeader.innerHTML = "Distance";

    let parentHeader = document.createElement("th");
    parentHeader.innerHTML = "Parent";

    tableHeaderRow.appendChild(vertexHeader);
    tableHeaderRow.appendChild(vistedHeader);
    tableHeaderRow.appendChild(distanceHeader);
    tableHeaderRow.appendChild(parentHeader);

    tableHeader.appendChild(tableHeaderRow);
    table.appendChild(tableHeader);

    //add in rows
    let tableBody = document.createElement("tbody");
    for(let node of graph.nodes.keys()) {
        let tableRow = document.createElement("tr");
        
        let vertexEntry = document.createElement("td");
        vertexEntry.innerHTML = node;

        let vistedEntry = document.createElement("td");
        
        if(visted.has(node)) {
            vistedEntry.innerHTML = "Visted";
        } else if (unvisited.has(node)) {
            vistedEntry.innerHTML = "Not Visted";
        }

        let distanceEntry = document.createElement("td");
        distanceEntry.innerHTML = distances.get(node);

        let parentEntry = document.createElement("td");

        if(!predecessors.get(node)) {
            parentEntry.innerHTML = ""
        } else {
            parentEntry.innerHTML = predecessors.get(node);
        }

        tableRow.appendChild(vertexEntry);
        tableRow.appendChild(vistedEntry);
        tableRow.appendChild(distanceEntry);
        tableRow.appendChild(parentEntry);

        tableBody.appendChild(tableRow);
    }

    table.appendChild(tableBody);
    container.appendChild(table);
}

function updateDijkstraTable(graph, visted, unvisited, predecessors, distances) {
    let table = document.getElementById("dijkstraDistTable")
    let tableBody = table.querySelector("tbody")

    //remove all rows in table
    while(tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }

    //add new rows to table body
    for(let node of graph.nodes.keys()) {
        let tableRow = document.createElement("tr");
        
        let vertexEntry = document.createElement("td");
        vertexEntry.innerHTML = node;

        let vistedEntry = document.createElement("td");
        
        if(visted.has(node)) {
            vistedEntry.innerHTML = "Visted";
        } else if (unvisited.has(node)) {
            vistedEntry.innerHTML = "Not Visted";
        }

        let distanceEntry = document.createElement("td");
        distanceEntry.innerHTML = distances.get(node);

        let parentEntry = document.createElement("td");

        if(!predecessors.get(node)) {
            parentEntry.innerHTML = ""
        } else {
            parentEntry.innerHTML = predecessors.get(node);
        }

        tableRow.appendChild(vertexEntry);
        tableRow.appendChild(vistedEntry);
        tableRow.appendChild(distanceEntry);
        tableRow.appendChild(parentEntry);

        tableBody.appendChild(tableRow);
    }


}


