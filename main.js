import uniqid from "uniqid";
import padlockSrc from "./assets/candado.png"
import targetSrc from "./assets/target.png"

const startBtn = document.getElementById('start')

// function random(min, max) {
//   min = Math.ceil(min);
//   max = Math.floor(max);
//   return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
// }

class Scene {
  constructor() {
    this.canvas = document.getElementById('canvas');
    this.context = this.canvas.getContext('2d');
    this.width = window.innerWidth - 2;
    this.height = window.innerHeight - 90;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.nodes = [];
    this.edges = [];
    this.selectedNode = null;
    this.prevSelectedNode = null;
    this.isCliking = false;
    this.startClick = null;
    this.endClick = null;
    this.target = null;
  }
  findSelectedNode(x, y) {
    let node = null;
    this.nodes.forEach((e) => {
      if (e.x < x && e.x + e.width > x) {
        if (e.y < y && e.y + e.height > y) {
          node = e;
        }
      }
    })
    return node;
  }
  start() {
    this.updateIntervalID = setInterval(() => {
      this.clear();
      this.update();
    }, 30);
    this.initMousedown();
    this.initMousemove();
    this.initMouseup();
  }
  clear() {
    this.context.clearRect(0, 0, this.width, this.height);
  }
  update() {
    this.edges.forEach((e) => e.update())
    this.nodes.forEach((node) => node.update());
  }
  stop() {
    clearInterval(this.updateIntervalID);
  }
  initMousedown(){
    document.addEventListener('mousedown', (e) => {
      let node = this.findSelectedNode(e.x, e.y - 80);
      if(!node) return;
      this.startClick = +new Date();
      this.selectedNode = node;
      this.selectedNode.roll = this.isCliking ? 1 : 0;
      this.isCliking = true;
    });
  }
  initMouseup(){
    document.addEventListener('mouseup',(e) => {
      this.isCliking = false;
      if (this.selectedNode) {
        this.endClick = +new Date();
        let diff = this.endClick - this.startClick;
        if (diff < 100 && this.prevSelectedNode && this.selectedNode.id === this.prevSelectedNode.id) {
          this.selectedNode.roll = 2;
          if(this.target) this.target.roll = 0;
          this.target = this.selectedNode;
        }
      }
      this.prevSelectedNode = this.selectedNode;
      this.selectedNode = null;
    });
  }
  initMousemove(){
    document.addEventListener('mousemove', (e) => {
      if(this.isCliking) {
        let node = this.findSelectedNode(e.x, e.y - 80);
        if(!node) return;
        this.startClick = +new Date();
        this.selectedNode = node;
        this.selectedNode.roll = this.isCliking ? 1 : 0;
      }
    })
  }
  findNodeById(id) {
    let node = null;
    this.nodes.forEach((e) => e.id == id ? node = e : null)
    return node
  }
  findEdge(n1, n2) {
    let edge = null;
    this.edges.forEach(e => e.link.has(n1) && e.link.has(n2) ? edge = e : null)
    return edge;
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
    this.width = 52;
    this.height = 52;
    this.text = text;
    this.neighbors = [];
    this.color = "#00ff00";
    this.borderColor = this.color;
    this.id = uniqid();
    this.visited = false;
    this.padlockImg = new Image();
    this.padlockImgAv = false;
    this.targetImgAv = false;
    this.padlockImg.src = padlockSrc;
    this.padlockImg.onload = () => this.padlockImgAv = true;
    this.targetImg = new Image();
    this.targetImg.src = targetSrc;
    this.targetImg.onload = () => this.targetImgAv = true;
    this.roll = 0;
  }
  update() {
    let context = scene.context;
    context.fillStyle = this.color;
    context.fillRect(this.x,this.y,this.width - 3,this.height - 3)
    if(this.roll === 1 && this.padlockImgAv) context.drawImage(this.padlockImg,this.x + 3,this.y + 3,this.width - 10,this.height - 10);
    if(this.roll === 2 && this.targetImgAv) context.drawImage(this.targetImg,this.x + 3,this.y + 3,this.width - 10,this.height - 10);
  }
}


function setNodes() {
  let size = 52;
  let h = scene.canvas.clientHeight / size
  let w = scene.canvas.clientWidth / size

  let nodes = []
  for(let i = 0; i < h; i++){
    for(let k = 0; k < w; k++){
      let x = k * size;
      let y = i * size + 1;
      let node = new Node(x,y,`${i}-${k}`);
      if(i > 0){
        let [nei] = nodes.filter((e) => e.text == `${i-1}-${k}`)
        node.neighbors.push(nei)
        nei.neighbors.push(node)
        let edge = new Edge(node,nei)
        scene.edges.push(edge)
      }
      if(k > 0){
        let [nei] = nodes.filter((e) => e.text == `${i}-${k-1}`)
        node.neighbors.push(nei)
        nei.neighbors.push(node)
        let edge = new Edge(node,nei)
        scene.edges.push(edge)
      }
      nodes.push(node)
    }
  }
  nodes[0].start = true;
  nodes[0].borderColor = '#f00'
  scene.nodes = nodes;
}

setNodes();

function dfs(start, target) {
  let path = []
  let stack = [];
  stack.push(start)
  let len = 0;
  while (stack.length > 0 && len < 500) {
    len++
    let current = stack.pop();
    current.visited = true;
    path.push(current)
    scene.findNodeById(current.id).neighbors.forEach((e) => {
      if (!e.visited && e.roll !== 1) stack.push(e)
    })
    if (target.id === current.id) {
      stack = []
    }
  }
  drawPath(path)
}

function drawPath(path) {
  for (let i = 0; i < path.length; i++) {
    setTimeout(() => {
      let node = path[i]
      let edge = scene.findEdge(path[i], path[i + 1])
      if (node) {
        node.borderColor = '#f09f';
        node.color = '#f09f'
      }
      if (edge) edge.color = '#f09f'
    }, i * 50)
  }
}

startBtn.onclick = () => {
  dfs(scene.nodes[0], scene.target)
}
