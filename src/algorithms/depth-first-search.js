import scene from "../Scene"
import drawPath from "../drawPathAnimation"

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


export default dfs;