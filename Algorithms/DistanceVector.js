// Referencia algoritmo: https://www.youtube.com/watch?v=hdpnoOcrGck&t=228s&ab_channel=Simplilearn

const { readFile } = require("./loadSettings.js");

const printTable = (table, names) => {
  let output = "";
  for (let node in table) {
    output += `${names[node]}:\n`;
    for (let dest in table[node]) {
      output += `  ${names[dest]}: ${table[node][dest]} via ${names[node]}\n`;
    }
  }
  return output;
};

const distanceVectorRouting = (graph) => {
  const tables = {};

  for (let node in graph) {
    tables[node] = {};
    for (let dest in graph) {
      tables[node][dest] = Infinity;
    }
    tables[node][node] = 0;
    graph[node].forEach((neighbor) => {
      tables[node][neighbor] = 1;
    });
  }

  let changed = true;
  while (changed) {
    changed = false;
    for (let node in graph) {
      for (let neighbor of graph[node]) {
        for (let dest in graph) {
          if (
            tables[node][dest] >
            tables[neighbor][dest] + tables[node][neighbor]
          ) {
            tables[node][dest] =
              tables[neighbor][dest] + tables[node][neighbor];
            changed = true;
          }
        }
      }
      ``;
    }
  }

  return tables;
};

const loadSettings = async () => {
  topo = await readFile("./Settings/topo-demo.txt");
  names = await readFile("./Settings/names-demo.txt");

  let config = topo.config;
  let newConfig = {};
  for (let key in config) {
    if (newConfig[key] == undefined) {
      newConfig[key] = [];
    }
    let array = config[key];
    for (let i = 0; i < array.length; i++) {
      let value = array[i];
      newConfig[key].push(value);
    }
  }
  topo.config = newConfig;

  return { topo, names };
};

// esta funcion calcula las tablas para todos los nodos
const startRouting = async () => {
  let { topo, names } = await loadSettings();
  let graph = topo.config;
  let namesConfig = names.config;

  const tables = distanceVectorRouting(graph);
  console.log(printTable(tables, namesConfig));
};

startRouting();

const startRoutingFromTo = async (source, destination) => {
  let { topo, names } = await loadSettings();
  let graph = topo.config;
  let namesConfig = names.config;

  if (!graph[source] || !graph[destination]) {
    console.log("El nodo origen o destino no existen en el grafo.");
    return;
  }

  const tables = distanceVectorRouting(graph);

  console.log(
    `Tabla de enrutamiento desde ${namesConfig[source]} hacia ${namesConfig[destination]}:`
  );
  console.log(
    `Destino: ${namesConfig[destination]}, Costo: ${tables[source][destination]} via ${namesConfig[source]}`
  );
};

// implementar protocol
// startRoutingFromTo("A", "B");
