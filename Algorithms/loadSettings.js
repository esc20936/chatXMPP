// read txt file
const fs = require("fs");

function readFilePromise(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

const readFile = async (path) => {
  try {
    let data = await readFilePromise(path);
    let res = JSON.parse(data);
    return res;
  } catch (err) {
    console.error(err);
    return {};
  }
};

module.exports = {
  readFile,
};
