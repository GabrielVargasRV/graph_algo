import scene from "./Scene"

class Edge {
    constructor(neigh1, neigh2) {
      this.n1 = neigh1;
      this.n2 = neigh2;
      this.link = new Set()
      this.link.add(neigh1);
      this.link.add(neigh2);
      this.color = '#000'
    }
    update() {
      const context = scene.context;
      context.strokeStyle = this.color;
      context.beginPath();
      context.lineWidth = 2;
      // draw line from neighbor 1 to neighbor 2
      const fromX = this.n1.x + this.n1.width / 2
      const fromY = this.n1.y + this.n1.height / 2
      const toX = this.n2.x + this.n2.width / 2
      const toY = this.n2.y + this.n2.height / 2
      context.moveTo(fromX, fromY)
      context.lineTo(toX, toY)
      context.stroke()
    }
}


export default Edge;
  
