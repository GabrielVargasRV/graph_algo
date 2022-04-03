import scene from "./Scene"
import padlockSrc from "./assets/candado.png";
import targetSrc from "./assets/target.png";
import startSrc from "./assets/start.png";

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


export default Node;