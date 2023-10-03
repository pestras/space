export class Vector {

  constructor(readonly x = 0, readonly y = 0) {}

  length() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }
}