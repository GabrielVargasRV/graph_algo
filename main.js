import padlockSrc from "./assets/candado.png";
import targetSrc from "./assets/target.png";
import startSrc from "./assets/start.png";

const startBtn = document.getElementById('start');
const selectElement = document.getElementById('algorithms');

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
scene.start();

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


class Node {
  constructor(x, y, text) {
    this.x = x;
    this.y = y;
    this.roll = 0;
    this.id = text;
    this.text = text;
    this.neighbors = [];
    this.color = "#00ff00";
    this.startImgAv = false;
    this.targetImgAv = false;
    this.padlockImgAv = false;
    this.width = scene.nodeSize;
    this.height = scene.nodeSize;
    this.startImg = new Image();
    this.targetImg = new Image();
    this.padlockImg = new Image();
    this.borderColor = this.color;
    this.startImg.src = startSrc;
    this.targetImg.src = targetSrc;
    this.padlockImg.src = padlockSrc;
    this.startImg.onload = () => this.startImgAv = true;
    this.targetImg.onload = () => this.targetImgAv = true;
    this.padlockImg.onload = () => this.padlockImgAv = true;
  }
  update() {
    let context = scene.context;
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width - 2, this.height - 2)
    if (this.roll === 1 && this.padlockImgAv) context.drawImage(this.padlockImg, this.x + 4, this.y + 3, this.width - 10, this.height - 10);
    if (this.roll === 2 && this.targetImgAv) context.drawImage(this.targetImg, this.x + 4, this.y + 3, this.width - 10, this.height - 10);
    if (this.roll === 3 && this.startImgAv) context.drawImage(this.startImg, this.x + 4, this.y + 3, this.width - 10, this.height - 10);
  }
}


function setNodes() {
  let size = scene.nodeSize;
  let h = scene.canvas.clientHeight / size
  let w = scene.canvas.clientWidth / size

  for (let i = 0; i < h - 1; i++) {
    for (let k = 0; k < w; k++) {
      let x = k * size;
      let y = i * size + 1;
      let id = `${i}-${k}`;
      let node = new Node(x, y, id);

      scene.nodes.set(id, node)

      if (k > 0) {
        //link the current node with the node at the left
        let neighbor = scene.nodes.get(`${i}-${k - 1}`)
        node.neighbors.push(neighbor)
        neighbor.neighbors.push(node)


        let edge = new Edge(node, neighbor)
        scene.edges.push(edge)
      }
      if (i > 0) {
        //link the current node with the node above
        let neighbor = scene.nodes.get(`${i - 1}-${k}`)
        node.neighbors.push(neighbor)
        neighbor.neighbors.push(node)

        let edge = new Edge(node, neighbor)
        scene.edges.push(edge)
      }
    }
  }

  // set the default position of the start and target node
  const startX = Math.floor((scene.width / 4) / scene.nodeSize);
  const startY = Math.floor((scene.height / 2) / scene.nodeSize);
  const targetX = startX * 3;
  const targetY = startY;
  scene.startNode = scene.nodes.get(`${startY}-${startX}`);
  scene.startNode.roll = 3;
  scene.target = scene.nodes.get(`${targetY}-${targetX}`);
  scene.target.roll = 2;
}

setNodes();

//Depth-first search algo
function dfs(start, target) {
  let stack = [start];
  const visited = new Set();


  while (stack.length > 0) {
    let current = stack.pop();
    scene.findNodeById(current.id).neighbors.forEach((e) => {
      // if the neighbor is not locked add it to the stack
      if (e.roll !== 1 && !visited.has(current.id)) stack.push(e)
    })
    // mark the current node as visited
    visited.add(current.id)
    if (target.id === current.id) stack = []
  }
  drawPath(visited)
}

//Breadth-first search algo
function bfs(start, target) {
  let queue = [start];
  const visited = new Set();
  while (queue.length > 0) {
    let current = queue.shift();
    scene.findNodeById(current.id).neighbors.forEach((e) => {
      // if the neighbor is not locked add it to the stack
      if (e.roll !== 1 && !visited.has(current.id)) queue.push(e)
    })
    // mark the current node as visited
    visited.add(current.id)
    if (target.id === current.id) return drawPath(visited)
  }
  drawPath(visited)
}

//Shortest path algo
function shortestPath(start, target) {
  let queue = [{ value: start, acentors: [] }];
  const visited = [];

  while (queue.length > 0) {
    const current = queue.shift();

    // check if the current node is not already visited
    if (visited.includes(current.value.id)) continue;
    //add it to the visited list
    visited.push(current.value.id);

    //add neighbors to the queue
    scene.findNodeById(current.value.id).neighbors.forEach((neighbor) => {
      // if the neighbor is not locked, add it to queue
      if (neighbor.roll !== 1) {
        queue.push({
          value: neighbor,
          acentors: current.acentors.concat([current.value.id])
        })
      }
    })


    //if the current node is the target, draw the animation and clear the queue array
    if (current.value.id === target.id) {
      drawPath(visited, '#00ff', current.acentors.concat(current.value.id), '#fff')
      queue = [];
    }
  }

}

function drawPath(path, color = '#00ff', acentors = [], acentorsColor = '#fff') {
  let delay = 3;
  let index = 0;
  scene.acentors = acentors;
  
  for (let id of path) {
    index++;
    setTimeout(() => {
      let node = scene.nodes.get(id);
      node.color = color;
    }, index * delay)
  }

  if (acentors) {
    for (let id of acentors) {
      index++;
      setTimeout(() => {
        let node = scene.nodes.get(id);
        node.color = acentorsColor;
      }, index * delay)
    }
  }
  scene.animationPath = [...path,...acentors];
  return
}

startBtn.onclick = () => {
  handleOnClick()
}


const handleOnClick = () => {
  scene.clearAnimation();
  switch (selectElement.value) {
    case 'depth':
      dfs(scene.startNode, scene.target)
      break;
  
    case 'breadth':
      bfs(scene.startNode, scene.target)
      break;
  
    case 'shortest':
      shortestPath(scene.startNode, scene.target)
      break;
  
    default:
      dfs(scene.startNode, scene.target)
      break;
  }
}