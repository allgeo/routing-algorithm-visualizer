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

function highlightPathAnimated(path) {
    let i = 0;
    animationRunning = true;
    // Highlight the starting and final node
    let startNode = cy.$("#" + path[0]);
    startNode.addClass("start-highlighted");
    let finalNode = cy.$("#" + path[path.length - 1]);
    finalNode.addClass("end-highlighted");

    function highlightNext() {
        if (i < path.length - 1) {
            let edgeId;
            //get the node numbers as an int
            let n1 = parseInt(path[i].slice(1));
            let n2 = parseInt(path[i + 1].slice(1));
            //Make sure that the node with the lower number goes first
            if (n1 < n2) {
                edgeId = path[i] + path[i + 1];
            } else {
                edgeId = path[i + 1] + path[i];
            }
            cy.$("#" + edgeId).addClass("highlighted");
            i++;
            setTimeout(highlightNext, 500); // highlight every 0.5 seconds
        } else {
            setTimeout(function () {
                unhighlightEdges(); // remove all highlights after a short delay
                setTimeout(function () {
                    animationRunning = false;
                    startNode.removeClass("start-highlighted");
                    finalNode.removeClass("end-highlighted");
                }, 1000); // wait for 1 second before setting animationRunning to false
            }, 1000); // wait for 1 second before unhighlighting
        }
    }
    //Remove highlights
    cy.elements().removeClass("highlighted");
    highlightNext();

    function unhighlightEdges() {
        // Remove the "highlighted" class from all edges
        cy.edges().removeClass("highlighted");
    }
    /* 
  setInterval(function() {
    if (!animationRunning) {
      highlightPathAnimated(path);
    }
  }, 5000); // check every 1 second if animation is running and start again if not
*/
}

//vars used to keep track of timeouts used in dvAlgo function for animations
var graphIntervalId;
var timeoutArr = [];

function initializeCostMatrix(adjacencyList) {
    let costMatrix = new Map();

    for (let [vertex, neighbors] of adjacencyList.nodes) {
        costMatrix.set(vertex, {});
        costMatrix.get(vertex)["changed"] = true;
        costMatrix.get(vertex)["distanceVector"] = {};
        costMatrix.get(vertex)["distanceVector"][vertex] = {
            distance: 0,
            hop: vertex,
        };
        neighbors.forEach((neighbor) => {
            costMatrix.get(vertex)["distanceVector"][neighbor["node"]] = {
                distance: neighbor["weight"],
                hop: neighbor["node"],
            };
        });
    }
    //add non-neighbor vertices to the distance vector of each vertex
    for (let key of adjacencyList.nodes.keys()) {
        let distanceVector = costMatrix.get(key)["distanceVector"];
        for (let node of adjacencyList.nodes.keys()) {
            if (distanceVector[node] === undefined) {
                distanceVector[node] = { distance: Infinity, hop: null };
            }
        }
    }
    return costMatrix;
}

function dvAlgo(adjacencyList, showPath, start, end) {
    let costMatrix = initializeCostMatrix(adjacencyList);

    //update annotation on screen
    document.getElementById("dvAnnotation").innerHTML =
        "Initially the distance vector of each vertex is the distance to each of its neighbours, and all non-neighbor vertices have a distance of infinity";

    //function used to created the distance vector tables for each vertex
    createTables(costMatrix);

    var startTimeout = 3000;

    //while algorithm has not converged
    while (!checkForConvergence(costMatrix)) {
        let updatedCostMatrix = new Map();

        //update annotation
        timeoutArr.push(
            setTimeout(() => {
                document.getElementById("dvAnnotation").innerHTML =
                    "Each node with an updated distance vector will share its distance vector with each of its neighbors";
            }, startTimeout)
        );

        for (let key of costMatrix.keys()) {
            let neighbors = adjacencyList.nodes.get(key);
            let changedNeighbors = [];

            //iterate through neighbors and check if their distance vector has changed
            for (let neighbor of neighbors) {
                if (costMatrix.get(neighbor["node"])["changed"] === true) {
                    //if neighbors distance vector has changed add neighbor to list of neighbors whose distance vector has changed
                    changedNeighbors.push(neighbor["node"]);
                }
            }

            let updatedDV = updateDistanceVector(
                key,
                changedNeighbors,
                costMatrix
            );
            let currentDV = costMatrix.get(key)["distanceVector"];
            let annotation = "After ";

            if (neighbors.length > 0) {
                for (let element of neighbors) {
                    annotation += element["node"] + ", ";
                }
                annotation +=
                    "share their distance vectors with " +
                    key +
                    ", " +
                    key +
                    " updates its distance vector";
            }

            //if distance vector has updated then update cost matrix and update distance vector table displayed on screen
            if (checkIfDistanceVectorUpdated(currentDV, updatedDV)) {
                updatedCostMatrix.set(key, {
                    changed: true,
                    distanceVector: updatedDV,
                });
                timeoutArr.push(
                    setTimeout(() => {
                        document.getElementById("dvAnnotation").innerHTML =
                            annotation;
                        updateDistanceVectorTable(key, updatedDV);
                    }, startTimeout)
                );
                startTimeout += 3000;
            } else {
                updatedCostMatrix.set(key, {
                    changed: false,
                    distanceVector: currentDV,
                });
            }
        }
        costMatrix = updatedCostMatrix;
    }

    //update annotation
    timeoutArr.push(
        setTimeout(() => {
            document.getElementById(
                "dvAnnotation"
            ).innerHTML = `No updates from neighbor nodes have been sent, so now each node has the shortest distance to all other nodes in the network. See graph above to see path from ${start} to ${end}`;
        }, startTimeout + 2000)
    );

    let path = getPath(start, end, costMatrix);

    timeoutArr.push(
        setTimeout(() => {
            graphIntervalId = setInterval(() => {
                showPath(path);
            }, 3000);
        }, startTimeout + 3000)
    );

    //showPath(path);
    return costMatrix;
}

function updateDistanceVector(currentNode, changedNeighbors, costMatrix) {
    let newDV = {};
    for (let vertex of costMatrix.keys()) {
        let minDis = Infinity;
        let hop = null;
        for (let neighbor of changedNeighbors) {
            let distanceFromCurrentNodeToVertex =
                costMatrix.get(currentNode)["distanceVector"][vertex][
                    "distance"
                ];
            let distanceToNeighbor =
                costMatrix.get(currentNode)["distanceVector"][neighbor][
                    "distance"
                ];
            let distanceFromNeighborToVertex =
                costMatrix.get(neighbor)["distanceVector"][vertex]["distance"];

            if (
                minDis !== Infinity &&
                distanceToNeighbor + distanceFromNeighborToVertex < minDis
            ) {
                minDis = distanceToNeighbor + distanceFromNeighborToVertex;
                hop = costMatrix.get(currentNode)['distanceVector'][neighbor]['hop'];
            } else if (
                minDis === Infinity &&
                distanceToNeighbor + distanceFromNeighborToVertex <
                    distanceFromCurrentNodeToVertex
            ) {
                minDis = distanceToNeighbor + distanceFromNeighborToVertex;
                hop = costMatrix.get(currentNode)['distanceVector'][neighbor]['hop'];
            }
        }

        //if minDis has not changed then distance from currentNode to vertex is already shortest so don't update distance
        if (minDis === Infinity) {
            newDV[vertex] =
                costMatrix.get(currentNode)["distanceVector"][vertex];
        } else {
            //otherwise update distance to minimum distance
            newDV[vertex] = { distance: minDis, hop: hop };
        }
    }

    return newDV;
}

function checkIfDistanceVectorUpdated(currentDV, newDV) {
    for (let vertex of Object.keys(currentDV)) {
        if (currentDV[vertex]["distance"] !== newDV[vertex]["distance"]) {
            return true;
        }
    }
    return false;
}

function checkForConvergence(costMatrix) {
    for (let node of costMatrix.keys()) {
        if (costMatrix.get(node)["changed"] === true) {
            return false;
        }
    }
    return true;
}

function getPath(start, destination, minCostMatrix) {
    let path = [];
    path.push(start);
    let currentNode = start;

    while (currentNode != destination) {
        let nextNode =
            minCostMatrix.get(currentNode)["distanceVector"][destination][
                "hop"
            ];
        path.push(nextNode);
        currentNode = nextNode;
    }

    return path;
}



// With bootstrap
function createDistanceVectorTable(vertex, costMatrix) {
    // Get the container for distance vector tables
    let distanceVectorContainer = document.getElementById("currentDistanceVectorsContainer");
  
    // Create a new table
    let table = document.createElement("table");
    table.setAttribute("id", `${vertex}DV`);
    table.classList.add("table", "table-bordered", "table-striped");
  
    // Create a table header with caption
    let tableHeader = document.createElement("thead");
    tableHeader.classList.add("table-dark");
    let tablecaption = document.createElement("caption");
    tablecaption.innerHTML = `${vertex}`;
    tablecaption.classList.add("fs-6", "fw-bold", "mb-1", "text-center");
    tablecaption.setAttribute("colspan", "3"); // add colspan attribute
    tableHeader.appendChild(tablecaption);
  
    // Create table header elements
    let tableHeaderRow = document.createElement("tr");
    let tableHeadElement = document.createElement("th");
    tableHeadElement.innerHTML = "Vertex";
    tableHeaderRow.appendChild(tableHeadElement);
    tableHeadElement = document.createElement("th");
    tableHeadElement.innerHTML = "Distance";
    tableHeaderRow.appendChild(tableHeadElement);
    tableHeadElement = document.createElement("th");
    tableHeadElement.innerHTML = "Hop";
    tableHeaderRow.appendChild(tableHeadElement);
    tableHeader.appendChild(tableHeaderRow);
    table.appendChild(tableHeader);
  
    // Add the table to the container
    let tableContainer = document.createElement("div");
    tableContainer.classList.add("col-md-2", "col-sm-12", "mb-3");
    tableContainer.appendChild(table);
    let tableRow = distanceVectorContainer.lastElementChild;
    if (!tableRow || tableRow.children.length == 6) {
      // Create a new row if the last row is full
      tableRow = document.createElement("div");
      tableRow.classList.add("row");
      distanceVectorContainer.appendChild(tableRow);
    }
    // Add the table container to the row
    tableRow.appendChild(tableContainer);
  
    // Get the distance vector for the vertex
    let distanceVector = costMatrix.get(vertex)["distanceVector"];
  
    // Create a table body
    let tableBody = document.createElement("tbody");
  
    // Add table rows for each vertex in the distance vector
    for (let key of Object.keys(distanceVector)) {
      let tableRow = document.createElement("tr");
  
      // Create table cells for vertex, distance, and hop
      let vertexTableEntry = document.createElement("td");
      vertexTableEntry.innerHTML = key;
  
      let distanceTableEntry = document.createElement("td");
      distanceTableEntry.innerHTML = distanceVector[key]["distance"];
  
      let hopTableEntry = document.createElement("td");
      hopTableEntry.innerHTML =
        distanceVector[key]["hop"] === null ? "None" : distanceVector[key]["hop"];
  
      // Add the cells to the row
      tableRow.appendChild(vertexTableEntry);
      tableRow.appendChild(distanceTableEntry);
      tableRow.appendChild(hopTableEntry);
  
      // Add the row to the table body
      tableBody.appendChild(tableRow);
    }
  
    // Add the table body to the table
    table.appendChild(tableBody);
}
  

function updateDistanceVectorTable(vertex, distanceVector) {
    let table = document.getElementById(`${vertex}DV`);
    let tableBody = table.querySelector("tbody");

    //delete the current rows of the table body
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }

    //update distance vector table for vertex
    for (let key of Object.keys(distanceVector)) {
        let tableRow = document.createElement("tr");

        let vertexTableEntry = document.createElement("td");
        vertexTableEntry.innerHTML = key;

        let distanceTableEntry = document.createElement("td");
        distanceTableEntry.innerHTML = distanceVector[key]["distance"];

        let hopTableEntry = document.createElement("td");
        hopTableEntry.innerHTML =
            distanceVector[key]["hop"] === null
                ? "None"
                : distanceVector[key]["hop"];

        tableRow.appendChild(vertexTableEntry);
        tableRow.appendChild(distanceTableEntry);
        tableRow.appendChild(hopTableEntry);

        tableBody.appendChild(tableRow);
    }
}

function createTables(costMatrix) {
    for (let vertex of costMatrix.keys()) {
        createDistanceVectorTable(vertex, costMatrix);
    }
}

function initializeAnnotations() {
    if (document.getElementById("dvAnnotation")) {
        let element = document.getElementById("dvAnnotation");
        element.innerHTML = "";
    }

    if (document.getElementById("currentDistanceVectorsContainer")) {
        let container = document.getElementById(
            "currentDistanceVectorsContainer"
        );
        container.innerHTML = "";
    }

    //add annotation text box to explain what algorithm is doing at each step
    let dvAnnotationsContainer = document.getElementById(
        "dvAnnotationsContainer"
    );
    let annotation = document.createElement("h5");
    annotation.setAttribute("id", "dvAnnotation");
    annotation.innerHTML = "";

    //add table container to html
    let currentDistanceVectorsContainer = document.createElement("div");
    currentDistanceVectorsContainer.setAttribute(
        "id",
        "currentDistanceVectorsContainer"
    );
    currentDistanceVectorsContainer.style.display = "flex";
    currentDistanceVectorsContainer.style.flexDirection = "row";
    currentDistanceVectorsContainer.style.flexWrap = "wrap";

    //append new html elements to the dom
    dvAnnotationsContainer.appendChild(annotation);
    dvAnnotationsContainer.appendChild(currentDistanceVectorsContainer);
}

function runDV(start, end) {
    //create a new Graph adjacency List
    const currentgraph = new GraphAdjacencyList();
    //loop through nodes and add them to new graph
    cy.nodes().forEach(function (ele) {
        currentgraph.addNode(ele.id());
    });
    //loop through edges and add them to graph
    cy.edges().forEach(function (ele) {
        currentgraph.addEdge(
            ele.source().id(),
            ele.target().id(),
            parseInt(ele.data("weight"))
        );
    });
    //run Distance vector Algorithm
    initializeAnnotations();
    let result2 = dvAlgo(
        currentgraph,
        highlightPathAnimated,
        start,
        end
    );
}

//dynamically generate the drop down menus for DV algo
function assignDropDown() {
    nodelist = [];
    cy.nodes().forEach(function (ele) {
        nodelist.push(ele.id());
    });
    for (let i = 0; i < nodelist.length; i++) {
        let option = document.createElement("option");
        option.setAttribute("value", nodelist[i]);
        let optionText = document.createTextNode(nodelist[i]);
        option.appendChild(optionText);
        document.getElementById("dvNode1").appendChild(option);
    }
    for (let i = 0; i < nodelist.length; i++) {
        let option = document.createElement("option");
        option.setAttribute("value", nodelist[i]);
        let optionText = document.createTextNode(nodelist[i]);
        option.appendChild(optionText);
        document.getElementById("dvNode2").appendChild(option);
    }
}

function addToDropDown1(nodeId) {
    let option = document.createElement("option");
    option.setAttribute("value", nodeId);
    let optionText = document.createTextNode(nodeId);
    option.appendChild(optionText);
    document.getElementById("dvNode1").appendChild(option);
}
function addToDropDown2(nodeId) {
    let option = document.createElement("option");
    option.setAttribute("value", nodeId);
    let optionText = document.createTextNode(nodeId);
    option.appendChild(optionText);
    document.getElementById("dvNode2").appendChild(option);
}
//events on page load
window.addEventListener("load", (event) => {
    assignDropDown(); //dynamically fill DV dropboxes
    getStoredWeight(); //get stored values for the weight boxes
});

//click button for DV Algo
document.getElementById("dvButton").addEventListener("click", function () {
    let start = document.getElementById("dvNode1").value;
    let end = document.getElementById("dvNode2").value;
    //clear timeouts
    clearInterval(graphIntervalId);
    timeoutArr.forEach(clearTimeout);

    //run dv algo
    runDV(start, end);
});

document.getElementById("addNode").addEventListener("click", function () {
    let newNumber = cy.nodes().length;
    let newEdgeId = "n" + (newNumber - 1) + "n" + newNumber;
    let connection = "n" + (newNumber - 1) + "TOn" + newNumber;
    cy.add([
        {
            group: "nodes",
            data: { id: "n" + newNumber },
            position: { x: 100, y: 100 },
        },
        {
            group: "edges",
            data: {
                id: newEdgeId,
                source: "n" + (newNumber - 1),
                target: "n" + newNumber,
                weight: 1,
            },
        },
    ]);
    let newEdge = {
        edgeId: "#" + newEdgeId,
        weightInputId: connection,
    };
    edges.push(newEdge);
    createWeightBox(connection);
    addToDropDown1("n" + newNumber);
    addToDropDown2("n" + newNumber);
});

function dropdown() {
    let e = document.getElementById("dropdown");
    var value = e.options[e.selectedIndex].value;
    if (value == 1) {
        document.getElementById("dvSelect").hidden = true;
    } else {
        document.getElementById("dvSelect").hidden = false;
    }
}
