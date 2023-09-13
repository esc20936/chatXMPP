const { readFile } = require("./loadSettings.js");

const flooding = async (graph, start, end, names, topo) => {
    const queue = [];
    const visited = new Set();
    const shortestDistances = {};
    const jumpCosts = {}; // Objeto para almacenar los costos por salto

    queue.push(start);
    visited.add(start);
    shortestDistances[start] = { cost: 0 };

    while (queue.length > 0) {
        const vertex = queue.shift();

        if (vertex === end) {
            break;
        }

        const neighbors = graph[vertex];

        for (let neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                queue.push(neighbor);
                visited.add(neighbor);

                const costToVertex = shortestDistances[vertex].cost;
                const costToNeighbor = shortestDistances[neighbor]?.cost || Infinity;

                const newCostToNeighbor = costToVertex + 1;

                if (newCostToNeighbor < costToNeighbor) {
                    shortestDistances[neighbor] = { cost: newCostToNeighbor, from: vertex };
                    jumpCosts[neighbor] = newCostToNeighbor; // Almacenar el costo por salto
                }
            }
        }
    }

    if (!visited.has(end)) {
        console.log("No se encontró un camino entre los nodos");
        return;
    }

    const path = tracePath(shortestDistances, start, end, names, topo);
    const weight = shortestDistances[end].cost;

    console.log("Camino encontrado:");
    console.log(path.join(" -> "))
    console.log("Camino más corto es:", path.join(" -> "), "con peso", weight);
   
    // Imprimir la tabla de costos por salto
    console.log("Tabla de costos por salto:");
    Object.keys(jumpCosts).forEach((vertex) => {
        console.log(`${names[vertex]}: ${jumpCosts[vertex]}`);
    });
};

const tracePath = (shortestDistances, start, end, names, topo) => {
    const path = [];
    const nodes = [];

    let current = end;

    while (current !== start) {
        path.unshift(names[current]);
        nodes.unshift(topo[current]);
        current = shortestDistances[current].from;
    }
    nodes.unshift(topo[start]);
    path.unshift(names[start]);
    return nodes, path;
};

const loadSettings = async () => {
    try {
        const topoContent = await readFile("./Settings/topo-demo.txt");
        const topo = topoContent;

        const namesContent = await readFile("./Settings/names-demo.txt");
        const names = namesContent;

        const graph = topo.config;
        const namesConfig = names.config;

        return { graph, namesConfig };
    } catch (error) {
        console.error("Error loading settings:", error);
        throw error;
    }
};

const startFlooding = async (from, to) => {
    try {
        const { graph, namesConfig } = await loadSettings();

        if (graph[from] == undefined || graph[to] == undefined) {
            console.log("from or to is not in the graph");
            return;
        }

        await flooding(graph, from, to, namesConfig, graph);
    } catch (error) {
        console.error("Error starting flooding:", error);
    }
};

startFlooding("A", "B");