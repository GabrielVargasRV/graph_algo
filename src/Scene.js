
class Scene {
  constructor() {
    this.canvas = document.getElementById('canvas');
    this.context = this.canvas.getContext('2d');
    this.width = window.innerWidth - 2;
    this.height = window.innerHeight - 90;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.nodes = new Map();
    this.edges = [];
    this.animationPath = null;
    this.isCliking = false;
    this.target = null;
    this.startNode = null;
    this.nodeSize = 30;
    this.holdingStart = false;
    this.holdingTarget = false;
  }


  findSelectedNode(x, y) {
    let str = `${Math.floor(y / this.nodeSize)}-${Math.floor(x / this.nodeSize)}`;
    return this.nodes.get(str);
  }


  start() {
    this.updateIntervalID = setInterval(() => {
      //clear canvas every frame
      this.clear();
      this.update();
    }, 30);
    this.initMousedown();
    this.initMousemove();
    this.initMouseup();
  }


  clear() {
    // clear canvas
    this.context.clearRect(0, 0, this.width, this.height);
  }


  update() {
    //update all nodes
    // this.edges.forEach((e) => e.update())
    this.nodes.forEach((node) => node.update());
  }


  stop() {
    clearInterval(this.updateIntervalID);
  }


  initMousedown() {
    document.addEventListener('mousedown', (e) => {
      //find the node that the mouse is hovering over
      let node = this.findSelectedNode(e.x, e.y - 80);
      if (!node) return;
      this.isCliking = true;
      // if the node is the starting node or the target node, grab it for drag and drop.
      if (node.roll === 3) this.holdingStart = true;
      if (node.roll === 2) this.holdingTarget = true;
      //toggle for padlock node
      if(node.roll <= 1) node.roll = node.roll === 1 ? 0 : 1;
    });
  }


  initMouseup() {
    document.addEventListener('mouseup', (e) => {
      //set all mouse relate variables to default
      this.isCliking = false;
      this.holdingStart = false;
      this.holdingTarget = false;
    });
  }


  initMousemove() {
    document.addEventListener('mousemove', (e) => {
      // coords in canvas
      // 80 is the header height
      let x = e.x;
      let y = e.y - 80;

      //if the user is not clicking anythings, return
      if (!this.isCliking) return;
      //find the node that the mouse is hovering over
      let node = this.findSelectedNode(x, y);
      if (!node) return;

      // if the user is grabbing the starting node
      if (this.holdingStart) {
        this.startNode.roll = 0;
        this.startNode = node;
        this.startNode.roll = 3;
        this.clearAnimation();
      } 
      // if the user is grabbing the target node
      else if (this.holdingTarget) {
        this.target.roll = 0;
        this.target = node;
        this.target.roll = 2;
        this.clearAnimation();
      } else {
        node.roll = this.isCliking ? 1 : 0;
      }
    })
  }


  findNodeById(id) {
    return this.nodes.get(id)
  }


  findEdge(n1, n2) {
    // find edge between two nodes
    let edge = null;
    this.edges.forEach(e => e.link.has(n1) && e.link.has(n2) ? edge = e : null)
    return edge;
  }

  clearAnimation() {
    //clear the las animation
    if (!this.animationPath) return;
    for (let id of this.animationPath) {
      scene.nodes.get(id).color = '#00ff00'
    }
    this.animatonPath = [];
  }
}

const scene = new Scene();
export default scene;