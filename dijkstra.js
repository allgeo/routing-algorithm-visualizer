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
        
      
        //Add node with least distance to previous node to visited and remove from unvisited
        visited.add(minNode);
        unvisited.delete(minNode);

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

    const result = dijkstra(graph, "n0", "n11");
    const shortestPathNodes = result.pathFromStartNodeToEndNode;

    console.log(result)

    return shortestPathNodes;// Should ideally return [ 'n0', 'n1', 'n2', 'n7', 'n8', 'n11' ] (shortest path from n0 to n11)
}

runDijkstra()
