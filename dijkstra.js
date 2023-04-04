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
        
        if(minNode == endNode){
            break;
        }
        //Add node with least distance to previous node to visited and remove from unvisited
        visited.add(minNode);
        unvisited.delete(minNode);

        //Unvisited neighbour nodes of current visited node 
        const neighbours = graph.nodes.get(minNode);
        //Loop through unvisited neighbor nodes 
        for(const neighbour of neighbours){
            if(!visited.has(neighbour.node)){
                //Calculate distance to from current visited node to neighbour node 
                const distToNeighbour = distances.get(minNode) + neighbour.weight;
                //Update distance to neighbour node if new distance is shorter than distance to current 
                if (distToNeighbour < distances.get(neighbour.node)){
                    distances.set(neighbour.node, distToNeighbour);
                    //Update predecessor node as distance to neighbour updates
                    predecessor.set(neighbour.node, minNode);
                } 
            }
        }
    }     

    //Build shortest path from start node to end node from map of predecessor nodes
    const path = [];
    let current = endNode;
    while(predecessor.has(current)){
        path.unshift(current);
        current = predecessor.get(current);
    }
    path.unshift(startNode);
    
    //Return path and distance
    return { path, distance: distances.get(endNode) };
}

//NOT DONE
function runDijkstra() {

    var graph = new GraphAdjacencyList();

    // Add nodes from Cytoscape to the graph
    graph.addNode("n0");
    graph.addNode("n1");
    graph.addNode("n2");
    graph.addNode("n3");
    graph.addNode("n4");
    graph.addNode("n5");
    graph.addNode("n6");
    graph.addNode("n7");
    graph.addNode("n8");
    graph.addNode("n9");
    graph.addNode("n10");
    graph.addNode("n11");
    
    // Add edges with weights from the cytoscape graph while also converting the weight values from string to integer
    graph.addEdge("n0","n1",parseInt(document.getElementById("n0TOn1").value, 10));
    graph.addEdge("n0","n3",parseInt(document.getElementById("n0TOn3").value, 10));
    graph.addEdge("n0","n4",parseInt(document.getElementById("n0TOn4").value, 10));
    graph.addEdge("n1","n2",parseInt(document.getElementById("n1TOn2").value, 10));
    graph.addEdge("n2","n7",parseInt(document.getElementById("n2TOn7").value, 10));
    graph.addEdge("n2","n3",parseInt(document.getElementById("n2TOn3").value, 10));
    graph.addEdge("n3", "n4",parseInt(document.getElementById("n3TOn4").value, 10));
    graph.addEdge("n3","n6",parseInt(document.getElementById("n3TOn6").value, 10));
    graph.addEdge("n3","n7",parseInt(document.getElementById("n3TOn7").value, 10));
    graph.addEdge("n4","n5",parseInt(document.getElementById("n4TOn5").value, 10));
    graph.addEdge("n5","n6",parseInt(document.getElementById("n5TOn6").value, 10));
    graph.addEdge("n5","n10",parseInt(document.getElementById("n5TOn10").value, 10));
    graph.addEdge("n6","n7",parseInt(document.getElementById("n6TOn7").value, 10));
    graph.addEdge("n7","n9",parseInt(document.getElementById("n7TOn9").value, 10));
    graph.addEdge("n7","n8",parseInt(document.getElementById("n7TOn8").value, 10));
    graph.addEdge("n8","n9",parseInt(document.getElementById("n8TOn9").value, 10));
    graph.addEdge("n8", "n11", parseInt(document.getElementById("n8TOn11").value, 10));
    graph.addEdge("n10", "n11", parseInt(document.getElementById("n10TOn11").value, 10));

    const result = dijkstra(graph, "n0", "n11");
    const shortestPathNodes = result.path;

    return shortestPathNodes;// Should ideally return [ 'n0', 'n1', 'n2', 'n7', 'n8', 'n11' ] (shortest path from n0 to n11)
}

runDijkstra()
