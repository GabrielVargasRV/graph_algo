import scene from "./Scene";
import Edge from "./Edge"
import Node from "./Node"

import dfs from "./algorithms/depth-first-search"
import bfs from "./algorithms/breadth-first-search"
import shortestPath from "./algorithms/shortest-path"

const startBtn = document.getElementById('start');
const selectElement = document.getElementById('algorithms');




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


setNodes();
scene.start();