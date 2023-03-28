var cy = (window.cy = cytoscape({
    container: document.getElementById("cy"),
    layout: { name: "cose" }, //cose layout
    style: [
        {
            selector: "node",
            css: {
                content: "data(id)",
                "text-valign": "center",
                "text-halign": "center",
            },
        },
        {
            selector: "edge",
            css: {
                label: "data(weight)",
                "text-margin-y": 15,
                "text-rotation": "autorotate",
            },
        },
        {
            selector: "edge.highlighted",
            css: {
              "line-color": "red",
              "target-arrow-color": "red",
              "source-arrow-color": "red",
              "z-index": 100
            }
          },
          {
            selector: 'node.start-highlighted',
            style: {
              'background-color': 'green'
            }
          },
          {
            selector: 'node.end-highlighted',
            style: {
              'background-color': 'blue'
            }
          },
    ],

    elements: {
        nodes: [
            { data: { id: 'n0' }, position: { x: -25, y: 100 } },
            { data: { id: "n1" }, position: { x: 125, y: 100 } },
            { data: { id: "n2" }, position: { x: 300, y: 100 } },
            { data: { id: "n3" }, position: { x: 125, y: 200 } },
            { data: { id: "n4" }, position: { x: -25, y: 200 } },
            { data: { id: "n5" }, position: { x: -100, y: 300 } },
            { data: { id: "n6" }, position: { x: 125, y: 300 } },
            { data: { id: "n7" }, position: { x: 300, y: 300 } },
            { data: { id: "n8" }, position: { x: 400, y: 0 } },
            { data: { id: "n9" }, position: { x: 400, y: 300 } },
            { data: { id: "n10" }, position: { x: -100, y: 0 } },
            { data: { id: "n11" }, position: { x: 200, y: 0 } },
        ],
        edges: [
            { data: { id: "n0n1", source: "n0", target: "n1", weight: 3 } },
            { data: { id: "n0n4", source: "n0", target: "n4", weight: 5 } },
            { data: { id: "n0n3", source: "n0", target: "n3", weight: 7 } },
            { data: { id: "n1n2", source: "n1", target: "n2", weight: 6 } },
            { data: { id: "n2n3", source: "n2", target: "n3", weight: 14 } },
            { data: { id: "n2n7", source: "n2", target: "n7", weight: 8 } },
            { data: { id: "n3n4", source: "n3", target: "n4", weight: 12 } },
            { data: { id: "n3n7", source: "n3", target: "n7", weight: 4 } },
            { data: { id: "n3n6", source: "n3", target: "n6", weight: 9 } },
            { data: { id: "n4n5", source: "n4", target: "n5", weight: 2 } },
            { data: { id: "n5n6", source: "n5", target: "n6", weight: 6 } },
            { data: { id: "n5n10", source: "n5", target: "n10", weight: 3 } },
            { data: { id: "n6n7", source: "n6", target: "n7", weight: 9 } },
            { data: { id: "n7n8", source: "n7", target: "n8", weight: 3 } },
            { data: { id: "n7n9", source: "n7", target: "n9", weight: 7 } },
            { data: { id: "n8n9", source: "n8", target: "n9", weight: 11 } },
            { data: { id: "n8n11", source: "n8", target: "n11", weight: 12 } },
            { data: { id: "n10n11", source: "n10", target: "n11", weight: 7 } },
        ],
    },
}));

var edges = [
    { edgeId: "#n0n1", weightInputId: "n0TOn1" },
    { edgeId: "#n0n3", weightInputId: "n0TOn3" },
    { edgeId: "#n0n4", weightInputId: "n0TOn4" },
    { edgeId: "#n1n2", weightInputId: "n1TOn2" },
    { edgeId: "#n2n7", weightInputId: "n2TOn7" },
    { edgeId: "#n2n3", weightInputId: "n2TOn3" },
    { edgeId: "#n3n4", weightInputId: "n3TOn4" },
    { edgeId: "#n3n6", weightInputId: "n3TOn6" },
    { edgeId: "#n3n7", weightInputId: "n3TOn7" },
    { edgeId: "#n4n5", weightInputId: "n4TOn5" },
    { edgeId: "#n5n6", weightInputId: "n5TOn6" },
    { edgeId: "#n5n10", weightInputId: "n5TOn10" },
    { edgeId: "#n6n7", weightInputId: "n6TOn7" },
    { edgeId: "#n7n9", weightInputId: "n7TOn9" },
    { edgeId: "#n7n8", weightInputId: "n7TOn8" },
    { edgeId: "#n8n9", weightInputId: "n8TOn9" },
    { edgeId: "#n8n11", weightInputId: "n8TOn11" },
    { edgeId: "#n10n11", weightInputId: "n10TOn11" },
];
// Add event listener to submit button
document.getElementById("submitBtn").addEventListener("click", function () {
    // Loop through the edges array
    edges.forEach(function (edge) {
        // Get the weight value from input
        console.log(edge);
        var weight = document.getElementById(edge.weightInputId).value;
        if (isNaN(parseInt(weight))) {
            console.log("Not a number, not updated")
        } else {
        // Store the weight value in localStorage
        localStorage.setItem(edge.weightInputId, weight);
        // Update the edge data with the new weight value
        cy.$(edge.edgeId).data("weight", weight);
        }
    });
});

// On page load, retrieve the weight values from the localStorage and update the edge data with them
edges.forEach(function (edge) {
    var storedWeight = localStorage.getItem(edge.weightInputId);
    if (storedWeight) {
        cy.$(edge.edgeId).data("weight", storedWeight);
        document.getElementById(edge.weightInputId).value = storedWeight;
    }
});


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


function dvAlgo(graph, startNode, endNode) {
    // Create distance and previous maps
    const distances = new Map();
    const previous = new Map();

    // Set the distance to the source node to 0 and all other nodes to infinity
    for (const node of graph.nodes.keys()) {
      distances.set(node, Infinity);
      previous.set(node, null);
    }
    distances.set(startNode, 0);
  
    // Run distance-vector algorithm
    let updated = true;
    // Repeatedly update the distances until they converge
    while (updated) {
      updated = false;
      // Loop through each node in the graph
      for (const [node, edges] of graph.nodes.entries()) {
        // Loop through each neighboring node of the current node
        for (const edge of edges) {
        // Calculate the distance to the neighboring node via the current node
          const distance = distances.get(node) + edge.weight;
           // If the new distance is shorter than the current distance to the neighboring node, update the distances map and previous nodes map
          if (distance < distances.get(edge.node)) {
            distances.set(edge.node, distance);
            previous.set(edge.node, node);
            updated = true;
          }
        }
      }
    }
  
     // Build the shortest path from the source node to the destination node by following the previous nodes map
    const path = [];
    let current = endNode;
    while (current !== null) {
      path.unshift(current);
      current = previous.get(current);
    }
  
    // Return path and distance
    return { path, distance: distances.get(endNode) };
  }


  let animationRunning = false;

  function highlightPathAnimated(path) {
    let i = 0;
    animationRunning = true;

  
    function highlightNext() {
      if (i < path.length - 1) {
        let edgeId;
  
        //Make sure that the node with the lower number goes first
        if (path[i] < path[i + 1]) {
          edgeId = path[i] + path[i + 1];
        } 
        else {
          edgeId = path[i + 1] + path[i];
        }
        let edge = cy.$("#" + edgeId);
        edge.addClass("highlighted");
  
        i++;
        setTimeout(highlightNext, 500); // highlight every 0.5 seconds
      }
      else {
        setTimeout(function() {
          unhighlightEdges(); // remove all highlights after a short delay
          setTimeout(function() {
            animationRunning = false;
          }, 1000); // wait for 1 second before setting animationRunning to false
        }, 1000); // wait for 1 second before unhighlighting
      }
    }
  
    //Remove highlights
    cy.elements().removeClass("highlighted");

    
  
    highlightNext();
  }
  
  function unhighlightEdges() {
    // Remove the "highlighted" class from all edges
    cy.edges().removeClass("highlighted");
  }
  
  // Test highlight
  let path = ["n0", "n1", "n2", "n7", "n6","n5", "n4"];

  // Highlight the starting and final node
  let startNode = cy.$("#" + path[0]);
  startNode.addClass("start-highlighted");
  let finalNode = cy.$("#" + path[path.length - 1]);
  finalNode.addClass("end-highlighted");
  
  setInterval(function() {
    if (!animationRunning) {
      highlightPathAnimated(path);
    }
  }, 1000); // check every 1 second if animation is running and start again if not




  // Create graph
const graph = new GraphAdjacencyList();
graph.addNode("A");
graph.addNode("B");
graph.addNode("C");
graph.addNode("D");
graph.addNode("E");
graph.addEdge("A", "B", 1);
graph.addEdge("A", "C", 5);
graph.addEdge("B", "C", 3);
graph.addEdge("B", "E", 9);
graph.addEdge("C", "D", 4);
graph.addEdge("D", "E", 2);


// Find shortest path between A and E
const result = dvAlgo(graph, "C", "E");
console.log(result)
console.log(`Shortest path: ${result.path.join(" -> ")}`);
console.log(`Total distance: ${result.distance}`);


/*
-----------------------------------------------------------------------------------------------------------------
*/
/*Alternative distance vector algo implementation*/
function initializeCostMatrix(adjacencyList){
    let costMatrix = new Map()

    for(let [vertex, neighbors] of adjacencyList.nodes) {
        costMatrix.set(vertex, {})
        costMatrix.get(vertex)['changed'] = true
        costMatrix.get(vertex)['distanceVector'] = {}
        costMatrix.get(vertex)['distanceVector'][vertex] = {'distance': 0, 'hop': vertex}
        neighbors.forEach(neighbor => {
            costMatrix.get(vertex)['distanceVector'][neighbor['node']] = {'distance': neighbor['weight'], 'hop': neighbor['node']}
        })
        
    }

    
    //add non-neighbor vertices to the distance vector of each vertex
    for(let key of adjacencyList.nodes.keys()) {
        let distanceVector = costMatrix.get(key)['distanceVector']
        for(let node of adjacencyList.nodes.keys()) {
                if(distanceVector[node] === undefined) {
                    distanceVector[node] = {'distance': Infinity, 'hop': null}
                }
        }

    }


    return costMatrix
}

function alternativeDVAlgo(adjacencyList) {
    let costMatrix = initializeCostMatrix(adjacencyList)
    console.log("Initially the distance vector of each vertex is the distance to each of its neighbours, and all non-neighbor vertices have a distance of infinity")
    //while algorithm has not converged
    while(!checkForConvergence(costMatrix)) {
        let updatedCostMatrix = new Map();
        console.log("Each node with an updated distance vector will share its distance vector with each of its neighbors")
        for(let key of costMatrix.keys()){
            let neighbors = adjacencyList.nodes.get(key)
            let changedNeighbors = []

            //iterate through neighbors and check if their cost matrix has changed
            for(let neighbor of neighbors) {
                if(costMatrix.get(neighbor['node'])['changed'] === true) {
                  //if neighbors distance vector has changed add neighbor to list of neighbors whose distance vector has changed
                  changedNeighbors.push(neighbor['node'])
                }
            }

            let updatedDV = updateDistanceVector(key, changedNeighbors, costMatrix)
            let currentDV = costMatrix.get(key)['distanceVector']
            let annotation = "After "

            if(neighbors.length > 0) {
              for(let element of neighbors) {
                //console.log(element['node'])
                annotation += element['node'] + ", "
              }
              annotation += "share their distance vectors with " + key + ", " + key + " updates its distance vector";
              console.log(annotation)
            }
            
            if(checkIfDistanceVectorUpdated(currentDV, updatedDV)) {
              updatedCostMatrix.set(key, {'changed':true, 'distanceVector': updatedDV})
            } else {
              updatedCostMatrix.set(key, {'changed':false, 'distanceVector': currentDV})
            }
        }
        costMatrix = updatedCostMatrix
    }
    console.log("No updates from neighbor nodes have been sent, so now each node has the shortest distance to all other nodes in the network")
    return costMatrix
}

function updateDistanceVector(currentNode, changedNeighbors, costMatrix){
    let newDV = {}
    for(let vertex of costMatrix.keys()) {
      let minDis = Infinity
      let hop = null
      for(let neighbor of changedNeighbors) {

        let distanceFromCurrentNodeToVertex = costMatrix.get(currentNode)['distanceVector'][vertex]['distance']
        let distanceToNeighbor = costMatrix.get(currentNode)['distanceVector'][neighbor]['distance']
        let distanceFromNeighborToVertex = costMatrix.get(neighbor)['distanceVector'][vertex]['distance']


        if(minDis !== Infinity && distanceToNeighbor + distanceFromNeighborToVertex < minDis) {
          minDis = distanceToNeighbor + distanceFromNeighborToVertex
          hop = neighbor
        }
        else if(minDis === Infinity && distanceToNeighbor + distanceFromNeighborToVertex < distanceFromCurrentNodeToVertex) {
          minDis = distanceToNeighbor + distanceFromNeighborToVertex
          hop = neighbor
        } 
        
      }
      
      //if minDis has not changed then distance from currentNode to vertex is already shortest so don't update distance
      if(minDis === Infinity) {
        newDV[vertex] = costMatrix.get(currentNode)['distanceVector'][vertex]
      } else { //otherwise update distance to minimum distance
        newDV[vertex] = {'distance': minDis, 'hop': hop}
      }
    }

    return newDV;

}

function checkIfDistanceVectorUpdated(currentDV, newDV) {
  for(let vertex of Object.keys(currentDV)) {
    if(currentDV[vertex]['distance'] !== newDV[vertex]['distance']) {
      return true;
    }
  }
  return false;
}

function checkForConvergence(costMatrix) {
    for(let node of costMatrix.keys()) {
        if(costMatrix.get(node)['changed'] === true) {
            return false;
        }
    }

    return true;
}

function getPath(start, destination, minCostMatrix) {
    let path = []
    path.push(start)
    let currentNode = start

    while(currentNode != destination){
      let nextNode = minCostMatrix.get(currentNode)['distanceVector'][destination]['hop']
      path.push(nextNode)
      currentNode = nextNode
    }

    return path;
}


let minCostMatrix = alternativeDVAlgo(graph)
console.log(getPath('A', 'D', minCostMatrix))
console.log(getPath('B', 'D', minCostMatrix))
console.log(getPath('E', 'C', minCostMatrix))
console.log('Shortest distance from E to C: ' + minCostMatrix.get('E')['distanceVector']['C']['distance'])


function runDV(){
  const currentgraph = new GraphAdjacencyList()
  cy.nodes().forEach(function( ele ){
  currentgraph.addNode( ele.id() );
 });
 cy.edges().forEach(function( ele ){
  currentgraph.addEdge( ele.source().id(),ele.target().id(), ele.data('weight'));
 });

 console.log(dvAlgo(currentgraph,'n0','n4'))

}

runDV();