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


  function highlightPath(path) {
    cy.elements().removeClass("highlighted");

    //Add highlight class to each edge in the path
    for (let i = 0; i < path.length - 1; i++) {
      let edge = cy.$("#" + path[i] + path[i + 1]);
      edge.addClass("highlighted");
    }
  }

  
  function unhighlightEdges() {
    // Remove the "highlighted" class from all edges
    cy.edges().removeClass("highlighted");
  }
  
  // Test highlight
  let path = ["n0", "n1", "n2", "n7", "n9"];
  highlightPath(path);

  //unhighlightEdges();



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
