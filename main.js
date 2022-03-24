import uniqid from "uniqid";

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
    this.startClick = null;
    this.endClick = null;
  }
  findSelectedNode(x,y){
    this.nodes.forEach((e) => {
      if(e.x < x && e.x + e.width > x){
        if(e.y < y && e.y + e.height > y){
          e.color = "#ff0000"
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
    }, 16);
    document.addEventListener('mousedown',(e) => {
      this.findSelectedNode(e.x,e.y - 80);
    });
    document.addEventListener('mouseup', (e) => {
      if(this.selectedNode){
        this.selectedNode.color = "#00ff00";
        this.endClick = +new Date();
        let diff = this.endClick - this.startClick;
        if(diff < 150) this.selectedNode.color = "#0000ff"
        console.log(diff)
      }
      this.selectedNode = null;
    });
    document.addEventListener('mousemove', (e) => {
      if(this.selectedNode){
        this.selectedNode.x = e.x - (this.selectedNode.width / 2);
        this.selectedNode.y = e.y - 80 - (this.selectedNode.height / 2);
      }
    });
  }
  clear() {
    this.context.clearRect(0, 0, this.width, this.height);
  }
  update() {
    this.nodes.forEach((node) => node.update());
  }
  stop(){
    clearInterval(this.updateIntervalID);
  }

}

const scene = new Scene();
scene.start();

class Node {
  constructor(x, y, text) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.text = text;
    this.edges = [];
    this.color = "#00ff00";
    this.id = uniqid();
  }
  update() {
    let ctx = scene.context;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

function setNodes(){
  let x = 10;
  let nodes = []
  for(let i = 0; i < 10; i++){
    x += 70
    nodes.push(new Node(x,10,'a'))
  }
  scene.nodes = nodes;
}

setNodes();

let adj = {
  a: ['b'],
  b: ['c', 'd'],
  c: ['f'],
  d: ['e'],
  f: ['g'],
  e: ['j'],
  j: ['h'],
  g: ['h'],
  h: []
}

let path = []

function dfs(target) {
  let stack = [];
  stack.push('a')

  while (stack.length) {
    let current = stack.pop();
    path.push(current)
    adj[current].forEach((e) => {
      stack.push(e)
    })
    if (target === current) {
      stack = []
    }
  }

  return path.join('->');
}

console.log(dfs('g'))
