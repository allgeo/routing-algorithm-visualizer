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
                "z-index": 100,
            },
        },
        {
            selector: "node.start-highlighted",
            style: {
                "background-color": "green",
            },
        },
        {
            selector: "node.end-highlighted",
            style: {
                "background-color": "blue",
            },
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
        console.log = edge;
        // Get the weight value from input
        var weight = document.getElementById(edge.weightInputId).value;
        if (isNaN(parseInt(weight))) {
            //            console.log("Not a number, not updated")
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

