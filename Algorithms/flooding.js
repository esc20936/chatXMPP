class Flooding_Algorithm {
  constructor(id, topology) {
    this.id = id;
    this.neighbors = topology.config[id];
    console.log(
      `Flooding node ${this.id} initialized with neighbors ${this.neighbors}`
    );
  }

  newNeighbor(neighbor) {
    if (!this.neighbors.includes(neighbor)) {
      this.neighbors.push(neighbor);
    }
  }

  updateTopology(topology) {
    this.neighbors = topology.config[this.id];
  }

  flood(packet) {
    if (packet.headers.to === this.id) {
      console.log(`Packet received at ${this.id} from ${packet.headers.from}`);
      console.log(`Packet payload: ${packet.payload}`);
      return;
    }

    if (packet.headers.hop_count > 10) {
      console.log(
        `Packet dropped from ${packet.headers.from} to ${this.id} (hop count exceeded)`
      );
      return;
    }

    if (this.neighbors.length === 0) {
      console.log(
        `Packet dropped from ${packet.headers.from} to ${this.id} (no neighbors)`
      );
      return;
    }

    console.log(
      `Flooding packet from ${packet.headers.from} to ${packet.headers.to} via ${this.id}`
    );
    packet.headers.hop_count++;
    return packet;
  }
}

module.exports = Flooding_Algorithm;
