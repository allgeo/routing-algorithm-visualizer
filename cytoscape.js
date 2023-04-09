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
              'background-color': 'grey',
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
          "line-color": "#1E90FF",
          "target-arrow-color": "#81D0ED",
          "source-arrow-color": "#81D0ED",
          "z-index": 100
        }
      },
      {
        selector: 'node.path-highlighted',
        style: {
          'border-color': '#81D0ED',
          'border-width': '2px'
        }
      },
],

  elements: {
      nodes: [
          { data: { id: "n0" }, position: { x: -25, y: 100 } },
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

var edges = [];

//create the edge array dynamicallly from the cytoscape graph
function fillEdges() {
  cy.edges().forEach(function (ele) {
      let newEdge = {
          edgeId: "#" + ele.id(),
          weightInputId: ele.source().id() + "TO" + ele.target().id(),
      };
      edges.push(newEdge);
  });
}
fillEdges();

function createWeightBox(edgeName) {
  let container = document.createElement("div");
  container.className = "col-3 col-md-2";
  let weightBox = document.createElement("div");
  weightBox.className = "form-floating";
  let inputBox = document.createElement("input");
  inputBox.className = "form-control";
  //inputBox.type = "text";
  inputBox.id = edgeName;
  let label = document.createElement("label");
  label.for = "";
  label.innerHTML = edgeName;
  weightBox.appendChild(inputBox);
  weightBox.appendChild(label);
  container.appendChild(weightBox);
  document.getElementById("weightBoxes").appendChild(container);
}

cy.edges().forEach(function (ele) {
  let edgeName = ele.source().id() + "TO" + ele.target().id();
  createWeightBox(edgeName);
});

// Add event listener to submit button
document.getElementById("submitBtn").addEventListener("click", function () {
    // Loop through the edges array
    edges.forEach(function (edge) {
        // Get the weight value from input
        console.log(edge);
        var weight = document.getElementById(edge.weightInputId).value;
        if (isNaN(parseInt(weight))) {
            console.log("Not a number, not updated")
        } else if (parseInt(weight) < 0){
          console.log("Cannot have a weight less than 0")
        } else {
        // Store the weight value in localStorage
        localStorage.setItem(edge.weightInputId, weight);
        // Update the edge data with the new weight value
        cy.$(edge.edgeId).data("weight", weight);
        }
    });
});

// On page load, retrieve the weight values from the localStorage and update the edge data with them
function getStoredWeight() {
  edges.forEach(function (edge) {
      var storedWeight = localStorage.getItem(edge.weightInputId);
      if (storedWeight) {
          cy.$(edge.edgeId).data("weight", storedWeight);
          document.getElementById(edge.weightInputId).value = storedWeight;
      }
  });
}

//========== Class used to create adjacency list data structure ==================================================
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

//====ANIMATION==============================================================================
let animationRunning = false;

//variables below used to keep track of the settimeout id's so that we can later clear them when the user re-runs any of the algorithms
let animationTimeoutIds = []
let animationIntervalId;


function highlightPathAnimated(path) {
  let i = 0;
  animationRunning = true;

  function highlightNext() {
    if (i < path.length - 1) {
      let edgeId;
      //get the node numbers as an int
      let n1 = parseInt(path[i].slice(1))
      let n2 = parseInt(path[i+1].slice(1))
      //Make sure that the node with the lower number goes first
      if (n1 < n2) {
        edgeId = path[i] + path[i + 1];
      } 
      else {
        edgeId = path[i + 1] + path[i];
      }
      cy.$("#" + edgeId).addClass("highlighted");

      let startNode = cy.$("#" + path[2]);
      startNode.addClass("path-highlighted");
      i++;
      animationTimeoutIds.push(setTimeout(highlightNext, 500)); // highlight every 0.5 seconds
      
    }
    else {
      animationTimeoutIds.push(setTimeout(function() {
        unhighlightEdges(); // remove all highlights after a short delay
        animationTimeoutIds.push(setTimeout(function() {
          animationRunning = false;
        }, 1000)); // wait for 1 second before setting animationRunning to false
      }, 1000)); // wait for 1 second before unhighlighting
    }
  }
  //Remove highlights
  cy.edges().removeClass("highlighted");
  highlightNext();
}

function unhighlightEdges() {
  // Remove the "highlighted" class from all edges
  cy.edges().removeClass("highlighted");
}

function runAnimation(path){
  animationTimeoutIds.forEach(clearTimeout)
  clearInterval(animationIntervalId)
  unhighlightEdges()

  const numNodes = cy.nodes().size();

  for (let i = 0; i <= numNodes - 1; i++) {
  cy.style().selector("#n" + i).css({
    'background-color': 'grey',
    'border-color': 'transparent',
    'border-width': '0'
  }).update();
}

  


 
  //Get first and last node
  let startNodeID = path[0];
  let endNodeID = path[path.length - 1];

  // Highlight the starting and final node with new CSS classes
  cy.style().selector("#" + startNodeID).css({ 'background-color': '#82C463', 'border-color': '#82C463', 'border-width': '2px' }).update();
  cy.style().selector("#" + endNodeID).css({ 'background-color': '#ED8181', 'border-color': '#ED8181', 'border-width': '2px' }).update();

  //Highlight nodes in between
  for (let i = 1; i < path.length - 1; i++) {
    cy.style().selector("#" + path[i]).css({ 'background-color': '#81D0ED', 'border-color': '#81D0ED', 'border-width': '2px' }).update();
    
  }

  animationIntervalId = setInterval(function() {
    if (!animationRunning) {
      highlightPathAnimated(path);
    }
  }, 1000); // check every 1 second if animation is running and start again if not

}


//=======================On click function to run algorithms when "Run Algorithm" button is clicked====================================================
//click button for DV Algo
document.getElementById("algoButton").addEventListener("click", function () {
  let start = document.getElementById("dvNode1").value;
  let end = document.getElementById("dvNode2").value;
  //clear timeouts
  clearInterval(distVecGraphIntervalId);
  distVecTimeoutArr.forEach(clearTimeout);
  dijkstaTimeoutArray.forEach(clearTimeout);
  //find the value of the dropdown
  let e = document.getElementById("dropdown");
  var value = e.options[e.selectedIndex].value;
  //1 is Dijkstra
  if (value == 1) 
  {
      //clear any annotations for dv algo 
      document.getElementById("dvAnnotationsContainer").innerHTML = "";
      //run Dijkstra goes here
      let shortestPath = runDijkstra(start, end);
      runAnimation(shortestPath);
  } 
  // else is DV
  else 
  {
      document.getElementById("dijkstraAnnotationsContainer").innerHTML = "";
      let shortestPath = runDV(start,end);
      runAnimation(shortestPath);
  } //run dv algo

 
});

//dynamically generate the drop down menus for both algorithms
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

function addToDropDown(nodeId, element) {
    let option = document.createElement("option");
    option.setAttribute("value", nodeId);
    let optionText = document.createTextNode(nodeId);
    option.appendChild(optionText);
    document.getElementById(element).appendChild(option);
}

//events on page load
window.addEventListener("load", (event) => {
    assignDropDown(); //dynamically fill dropboxes to select vertices for algorithms
    getStoredWeight(); //get stored values for the weight boxes
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
    addToDropDown("n" + newNumber, "dvNode1");
    addToDropDown("n" + newNumber, "dvNode2");
});



