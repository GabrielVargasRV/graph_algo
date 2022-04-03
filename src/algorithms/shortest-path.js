import scene from "../Scene";
import drawPath from "../drawPathAnimation";

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


export default shortestPath;
