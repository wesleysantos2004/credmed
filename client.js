console.clear();
const base = "http://localhost:3000";

const functions = {
  async getRequests() {
    const response = await fetch(base + "/");
    const body = await response.json();
    console.table(body);
  },
};

functions[process.argv[2]]();
