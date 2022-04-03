import scene from "./Scene"

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

export default drawPath;