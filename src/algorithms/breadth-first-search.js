import scene from "../Scene"
import drawPath from "../drawPathAnimation"

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

export default bfs;