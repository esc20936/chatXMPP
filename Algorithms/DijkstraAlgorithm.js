const { readFile } = require("./loadSettings.js");

const printTable = (table, names) => {
  return Object.keys(table)
    .map((vertex) => {
      var { vertex: from, cost } = table[vertex];
      return `${names[vertex]}: ${cost} via ${names[from]}`;
    })
    .join("\n");
};

const tracePath = (table, start, end, names) => {
  var path = [];
  var next = end;
  while (true) {
    path.unshift(next);
    if (next === start) {
      break;
    }
    next = table[next].vertex;
  }
  path = path.map((v) => names[v]);
  return path;
    };

const formatGraph = (g) => {
  const tmp = {};
  Object.keys(g).forEach((k) => {
    const obj = g[k];
    const arr = [];
    Object.keys(obj).forEach((v) => arr.push({ vertex: v, cost: obj[v] }));
    tmp[k] = arr;
  });
  return tmp;
};

const dijkstra = (graph, start, end, names) => {
  var map = formatGraph(graph);

  var visited = [];
  var unvisited = [start];
  var shortestDistances = { [start]: { vertex: start, cost: 0 } };

  var vertex;
  while ((vertex = unvisited.shift())) {
    // Explore unvisited neighbors
    var neighbors = map[vertex].filter((n) => !visited.includes(n.vertex));

    // Add neighbors to the unvisited list
    unvisited.push(...neighbors.map((n) => n.vertex));

    var costToVertex = shortestDistances[vertex].cost;

    for (let { vertex: to, cost } of neighbors) {
      var currCostToNeighbor =
        shortestDistances[to] && shortestDistances[to].cost;
      var newCostToNeighbor = costToVertex + cost;
      if (
        currCostToNeighbor == undefined ||
        newCostToNeighbor < currCostToNeighbor
      ) {
        // Update the table
        shortestDistances[to] = { vertex, cost: newCostToNeighbor };
      }
    }

    visited.push(vertex);
  }

  console.log("Table of costs:");
  console.log(printTable(shortestDistances, names));

  const path = tracePath(shortestDistances, start, end, names);

  console.log(
    "Shortest path is: ",
    path.join(" -> "),
    " with weight ",
    shortestDistances[end].cost
  );
};

const loadSettings = async () => {
  topo = await readFile("./Settings/topo-demo.txt");
  names = await readFile("./Settings/names-demo.txt");

  // set config
  let config = topo.config;
  let newConfig = {};
  for (let key in config) {
    if (newConfig[key] == undefined) {
      newConfig[key] = {};
    }
    let array = config[key];
    for (let i = 0; i < array.length; i++) {
      let value = array[i];
      newConfig[key][value] = 1;
    }
  }
  topo.config = newConfig;

  return { topo, names };
};

const startDijsktra = async (from, to) => {
  let { topo, names } = await loadSettings();
  let graph = topo.config;
  let namesConfig = names.config;

  //   validate tjat from and to are in the graph
  if (graph[from] == undefined || graph[to] == undefined) {
    console.log("from or to is not in the graph");
    return;
  }

  dijkstra(graph, from, to, namesConfig);
};

startDijsktra("A", "B");
