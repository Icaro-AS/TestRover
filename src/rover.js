
const helpers = require('./helpers')


const directions = ['N', 'E', 'S', 'W']


const rover = class Rover {

  constructor (x, y, direction) {
    if (typeof x !== 'number' || typeof y !== 'number' || parseInt(x) < 1 || parseInt(x) < 1) {
      throw new TypeError(`Expected x & y to be numbers, got x: ${typeof x} & y: ${typeof y}`);
    }
    if (typeof direction !== 'string' || (direction !== 'N' && direction !== 'E' && direction !== 'S' && direction !== 'W')) {
      throw new TypeError(`Expected direction to be string (N, E, S or W), got type ${typeof direction} with value of ${direction}`);
    }
    this._x = x
    this._y = y
    this._direction = direction
  }

  command (instructionsString) {
    const instructions = instructionsString.split('')
    return helpers.eachSeries(instructions, instruction => {
      if (instruction === 'M') {
        return this.move()
      } else {
        return this.rotate(instruction)
      }
    })
  }


  rotate (rotate) {
    return new Promise((resolve) => {
  
      setTimeout(() => {
        const rotateDir = (rotate === 'L') ? -1 : 1

        // get the correct
        let dir = directions.indexOf(this._direction) + rotateDir
        if (dir < 0) {
          dir = directions.length - 1
        } else if (dir >= directions.length) {
          dir = 0
        }
        this._direction = directions[dir]
        resolve()
      }, 50)
    })
  }

  move () {
    return new Promise((resolve) => {
      // simulate async rotation
      setTimeout(() => {
        switch (this._direction) {
          case 'N':
            this._y++
            break;
          case 'E':
            this._x++
            break;
          case 'S':
            this._y--
            break;
          case 'W':
            this._x--
            break;
        }
        resolve()
      }, 50)
    })
  }


  getCoordinates () {
    return `${this._x} ${this._y} ${this._direction}`
  }


  getX () {
    return this._x
  }

  getY () {
    return this._y
  }

  getDirection () {
    return this._direction
  }
}
module.exports = rover
