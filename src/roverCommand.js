
const helpers = require('./helpers')
const Rover = require('./rover')


const fs = require('fs');

const roverCommand = class RoverCommand {

  constructor (data) {
    if (typeof data !== 'string' && !data.length) {
      throw new TypeError(`Expected x & y to be numbers, got x: ${typeof x} & y: ${typeof y}`);
    }

    this.instructions = []
    this.rovers = {}

    if (typeof data === 'string' && data.indexOf('/') >= 0) {
      this._parse(fs.readFileSync(data).toString().split("\n"))
    } else if (typeof data === 'string') {
      this._parse(data.split("\n"))
    } else {
      this._parse(data)
    }
  }

  deploy () {
    return helpers.eachSeries(this.instructions, (instruction) => {
      this.rovers[instruction.name] = new Rover(instruction.deployZone[0], instruction.deployZone[1], instruction.deployZone[2])
    })
  }


  move () {
    return helpers.eachSeries(this.instructions, instruction => {
      const rover = this.rovers[instruction.name]
      return rover.command(instruction.commands)
    })
  }

  getRovers () {
    return this.rovers
  }


  _parse (instructions) {
    instructions.forEach((commands) => {
      if (commands.indexOf(';') >= 0) {
        commands = commands.split(';')
      }
      const deployZone = commands[1].split(' ')
      this.instructions.push({
        name:       commands[0],
        deployZone: [parseInt(deployZone[0]), parseInt(deployZone[1]), deployZone[2]],
        commands:   commands[2]
      })
    })
  }
}
module.exports = roverCommand
