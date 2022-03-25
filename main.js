import uniqid from "uniqid";
import padlockSrc from "./assets/candado.png"


const startBtn = document.getElementById('start')

function random(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

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
    this.startClick = null;
    this.endClick = null;
  }
  findSelectedNode(x, y) {
    this.nodes.forEach((e) => {
      if (e.x < x && e.x + e.width > x) {
        if (e.y < y && e.y + e.height > y) {
          // e.color = "#ff0000"
          this.startClick = +new Date();
          this.selectedNode = e;
        }
      }
    })
  }
  start() {
    this.updateIntervalID = setInterval(() => {
      this.clear();
      this.update();
    }, 30);


    document.addEventListener('mousedown', (e) => {
      this.findSelectedNode(e.x, e.y - 80);
    });
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));
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
  handleMouseUp(e) {
    if (this.selectedNode) {
      this.selectedNode.color = "#00ff00";
      this.endClick = +new Date();
      let diff = this.endClick - this.startClick;
      console.log(diff)
      if (diff < 100 && this.prevSelectedNode && this.selectedNode.id === this.prevSelectedNode.id) {
        console.log('si')
        this.selectedNode.blocked = !this.selectedNode.blocked;
        // this.selectedNode.color = "#0000ff"
        // if (this.lastSelectedNodes.length < 1) this.lastSelectedNodes.push(this.selectedNode)
      }
    }
    this.prevSelectedNode = this.selectedNode;
    this.selectedNode = null;
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

console.log('Hello World')

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
    this.width = 50;
    this.height = 50;
    this.text = text;
    this.neighbors = [];
    this.color = "#00ff00";
    this.borderColor = this.color;
    this.id = uniqid();
    this.visited = false;
    this.blocked = false;
    this.padlockImg = new Image();
    this.padlockImgAv = false;
    this.padlockImg.src = padlockSrc;
    this.padlockImg.onload = () => this.padlockImgAv = true;
  }
  update() {
    let context = scene.context;
    // context.beginPath();
    // context.lineWidth = 1;
    // const startAngle = 0;
    // const endAngle = Math.PI * 2;
    // context.strokeStyle = this.borderColor;
    // context.fillStyle = this.color;
    // context.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, startAngle, endAngle);
    // context.fill()
    // context.stroke();
    context.fillStyle = this.color;
    context.fillRect(this.x,this.y,this.width,this.height)
    if(this.blocked && this.padlockImgAv){
      context.drawImage(this.padlockImg,this.x + 5,this.y + 5,this.width - 10,this.height - 10)
    }
  }
}

let arr = [
  [{x:10,y: 10},{x:30,y: 10},{x:50,y: 10},{x:70,y: 10},{x:90,y: 10},{x:110,y: 10},{x:130,y: 10},{x:150,y: 10},{x:170,y: 10},{x:190,y: 10},{x:210,y: 10},{x:230,y: 10},{x:250,y: 10},{x:270,y: 10},{x:290,y: 10}],
  [{x:10,y: 30},{x:30,y: 30},{x:50,y: 30},{x:70,y: 30},{x:90,y: 30},{x:110,y: 30},{x:130,y: 30},{x:150,y: 30},{x:170,y: 30},{x:190,y: 30},{x:210,y: 30},{x:230,y: 30},{x:250,y: 30},{x:270,y: 30},{x:290,y: 30}],
  [{x:10,y: 50},{x:30,y: 50},{x:50,y: 50},{x:70,y: 50},{x:90,y: 50},{x:110,y: 50},{x:130,y: 50},{x:150,y: 50},{x:170,y: 50},{x:190,y: 50},{x:210,y: 50},{x:230,y: 50},{x:250,y: 50},{x:270,y: 50},{x:290,y: 50}],
  [{x:10,y: 70},{x:30,y: 70},{x:50,y: 70},{x:70,y: 70},{x:90,y: 70},{x:110,y: 70},{x:130,y: 70},{x:150,y: 70},{x:170,y: 70},{x:190,y: 70},{x:210,y: 70},{x:230,y: 70},{x:250,y: 70},{x:270,y: 70},{x:290,y: 70}],
  [{x:10,y: 90},{x:30,y: 90},{x:50,y: 90},{x:70,y: 90},{x:90,y: 90},{x:110,y: 90},{x:130,y: 90},{x:150,y: 90},{x:170,y: 90},{x:190,y: 90},{x:210,y: 90},{x:230,y: 90},{x:250,y: 90},{x:270,y: 90},{x:290,y: 90}],
  [{x:10,y:110},{x:30,y:110},{x:50,y:110},{x:70,y:110},{x:90,y:110},{x:110,y:110},{x:130,y:110},{x:150,y:110},{x:170,y:110},{x:190,y:110},{x:210,y:110},{x:230,y:110},{x:250,y:110},{x:270,y:110},{x:290,y:110}],
  [{x:10,y:130},{x:30,y:130},{x:50,y:130},{x:70,y:130},{x:90,y:130},{x:110,y:130},{x:130,y:130},{x:150,y:130},{x:170,y:130},{x:190,y:130},{x:210,y:130},{x:230,y:130},{x:250,y:130},{x:270,y:130},{x:290,y:130}],
  [{x:10,y:150},{x:30,y:150},{x:50,y:150},{x:70,y:150},{x:90,y:150},{x:110,y:150},{x:130,y:150},{x:150,y:150},{x:170,y:150},{x:190,y:150},{x:210,y:150},{x:230,y:150},{x:250,y:150},{x:270,y:150},{x:290,y:150}],
  [{x:10,y:170},{x:30,y:170},{x:50,y:170},{x:70,y:170},{x:90,y:170},{x:110,y:170},{x:130,y:170},{x:150,y:170},{x:170,y:170},{x:190,y:170},{x:210,y:170},{x:230,y:170},{x:250,y:170},{x:270,y:170},{x:290,y:170}],
  // [{x:10,y:190},{x:30,y:190},{x:50,y:190},{x:70,y:190},{x:90,y:190},{x:110,y:190},{x:130,y:190},{x:150,y:190},{x:170,y:190},{x:190,y:190},{x:210,y:190},{x:230,y:190},{x:250,y:190},{x:270,y:190},{x:290,y:190}],
]

function setNodes() {
  let nodes = []
  for(let i = 0; i < arr.length; i++){
    for(let k = 0; k < arr[i].length; k++){
      let x = arr[i][k].x * 2.8;
      let y = arr[i][k].y * 2.8;
      let node = new Node(x,y,`${i}${k}`);
      if(i > 0){
        let [nei] = nodes.filter((e) => e.text == `${i-1}${k}`)
        node.neighbors.push(nei)
        nei.neighbors.push(node)
        let edge = new Edge(node,nei)
        scene.edges.push(edge)
      }
      if(k > 0){
        let [nei] = nodes.filter((e) => e.text == `${i}${k-1}`)
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
  nodes[19].end = true;
  nodes[19].borderColor = '#00f';
  scene.nodes = nodes;
}

setNodes();

function dfs(start, target) {
  let path = []
  let stack = [];
  stack.push(start)
  let len = 0;
  while (stack.length > 0 && len < 300) {
    len++
    let current = stack.pop();
    current.visited = true;
    path.push(current)
    scene.findNodeById(current.id).neighbors.forEach((e) => {
      if (!e.visited && !e.blocked) stack.push(e)
    })
    if (target.id === current.id) {
      stack = []
    }
  }
  // console.log(stack)
  drawPath(path)
}

function drawPath(path) {
  // console.log(path)
  for (let i = 0; i < path.length; i++) {
    setTimeout(() => {
      if (i < 135) {
        let node = path[i]
        let edge = scene.findEdge(path[i], path[i + 1])
        if (node) {
          node.borderColor = '#f09f';
          node.color = '#f09f'
        }
        if (edge) edge.color = '#f09f'
      }
      return
    }, i * 50)
  }
}

startBtn.onclick = () => {
  dfs(scene.nodes[0], scene.nodes[19])
}
