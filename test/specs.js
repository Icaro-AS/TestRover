'use strict'

const {Rover, RoverCommand} = require('../src/index')

const assert = require('assert')

describe('Rover - Deploy Rover', () => {
  it(`Throw TypeError on wrong initialization "new Rover()"`, () => {
    assert.throws(() => new Rover(), TypeError)
  })
  it(`Throw TypeError on wrong initialization "new Rover('')", "new Rover({})", "new Rover([])"`, () => {
    assert.throws(() => new Rover(''), TypeError)
    assert.throws(() => new Rover({}), TypeError)
    assert.throws(() => new Rover([]), TypeError)
  })
  it(`Throw TypeError on wrong initialization "new Rover('A', 'B', 'C')"`, () => {
    assert.throws(() => new Rover('A', 'B', 'C'), TypeError)
  })
  it(`Throw TypeError on wrong initialization "new Rover(1, 1, 'C')"`, () => {
    assert.throws(() => new Rover(1, 1, 'C'), TypeError)
  })
  it("Deployed Rover(1, 1, 'S') has correct x, y and direction values", () => {
    const Rover1 = new Rover(1, 1, 'S')
    assert.equal(Rover1.getX(), 1)
    assert.equal(Rover1.getY(), 1)
    assert.equal(Rover1.getDirection(), 'S')
    assert.equal(Rover1.getCoordinates(), '1 1 S')
    assert.notEqual(Rover1.getDirection(), 'N')
  })
  it("Deployed Rover(3, 5, 'E') has correct x, y and direction values", () => {
    const Rover1 = new Rover(3, 5, 'E')
    assert.equal(Rover1.getX(), 3)
    assert.equal(Rover1.getY(), 5)
    assert.equal(Rover1.getDirection(), 'E')
    assert.equal(Rover1.getCoordinates(), '3 5 E')
    assert.notEqual(Rover1.getDirection(), 'S')
  })
})
describe('Rover - Rover Rotation', () => {
  it(`Deploy new Rover(3, 3, N) and rotate('L') should result in direction: 'W'`, async () => {
    const Rover1 = new Rover(3, 3, 'N')
    await Rover1.rotate('L')
    assert.equal(Rover1.getDirection(), 'W')
  })
  it(`Deploy new Rover(3, 3, E) and rotate('R') should result in direction: 'S'`, async () => {
    const Rover1 = new Rover(3, 3, 'E')
    await Rover1.rotate('R')
    assert.equal(Rover1.getDirection(), 'S')
  })
})
describe('Rover - Process instructions and move Rover', () => {
  it(`Deploy new Rover(1, 2, N) and command('MMM') should result in x: 1, y: 5, direction: 'N'`, (done) => {
    const Rover1 = new Rover(1, 2, 'N')
    Rover1.command('MMM').then(() => {
      assert.equal(Rover1.getX(), 1)
      assert.equal(Rover1.getY(), 5)
      assert.equal(Rover1.getCoordinates(), '1 5 N')
      assert.equal(Rover1.getDirection(), 'N')
      done()
    })
  })
  it(`Deploy new Rover(1, 2, N) and command('LMLMLMLMM') should result in x: 1, y: 3, direction: 'N'`, (done) => {
    const Rover1 = new Rover(1, 2, 'N')
    Rover1.command('LMLMLMLMM').then(() => {
      assert.equal(Rover1.getX(), 1)
      assert.equal(Rover1.getY(), 3)
      assert.equal(Rover1.getCoordinates(), '1 3 N')
      assert.equal(Rover1.getDirection(), 'N')
      done()
    })
  })
  it(`Deploy new Rover(3, 3, E) and command('MMRMMRMRRM') should result in x: 5, y: 1, direction: 'E'`, async () => {
    const Rover2 = new Rover(3, 3, 'E')
    await Rover2.command('MMRMMRMRRM')
    assert.equal(Rover2.getX(), 5)
    assert.equal(Rover2.getY(), 1)
    assert.equal(Rover2.getCoordinates(), '5 1 E')
    assert.equal(Rover2.getDirection(), 'E')
  })
})
describe('RoverCommand - Deploy Rovers by Text File', () => {
  it(`Throw TypeError on wrong initialization "new RoverCommand()"`, () => {
    assert.throws(() => new RoverCommand(1, 1, 'C'), TypeError)
  })
  it(`Deploy by configuration file`, async () => {
    const RoverCommandMars = new RoverCommand(__dirname + '/data/commands1.txt')
    await RoverCommandMars.deploy()
    const rovers = RoverCommandMars.getRovers()
    assert.equal(typeof rovers, 'object')
    assert.equal(rovers['Rover 1'].getCoordinates(), '1 2 N')
    assert.equal(rovers['Rover 2'].getCoordinates(), '3 3 E')
  })
  it(`Deploy by configuration string`, async () => {
    const RoverCommandMars = new RoverCommand('Rover 1;1 2 N;LMLMLMLMM\nRover 2;3 3 E;MMRMMRMRRM')
    await RoverCommandMars.deploy()
    const rovers = RoverCommandMars.getRovers()
    assert.equal(typeof rovers, 'object')
    assert.equal(rovers['Rover 1'].getCoordinates(), '1 2 N')
    assert.equal(rovers['Rover 2'].getCoordinates(), '3 3 E')
  })
  it(`Deploy by configuration array`, async () => {
    const RoverCommandMars = new RoverCommand([
      'Rover 1;1 2 N;LMLMLMLMM',
      'Rover 2;3 3 E;MMRMMRMRRM'
    ])
    await RoverCommandMars.deploy()
    const rovers = RoverCommandMars.getRovers()
    assert.equal(typeof rovers, 'object')
    assert.equal(rovers['Rover 1'].getCoordinates(), '1 2 N')
    assert.equal(rovers['Rover 2'].getCoordinates(), '3 3 E')
  })
  it(`Deploy by configuration array`, async () => {
    const RoverCommandMars = new RoverCommand([
      ['Rover 1', '1 2 N', 'LMLMLMLMM'],
      ['Rover 2', '3 3 E', 'MMRMMRMRRM']
    ])
    await RoverCommandMars.deploy()
    const rovers = RoverCommandMars.getRovers()
    assert.equal(typeof rovers, 'object')
    assert.equal(rovers['Rover 1'].getCoordinates(), '1 2 N')
    assert.equal(rovers['Rover 2'].getCoordinates(), '3 3 E')
  })
  it(`Move Rovers'`, async () => {
    const RoverCommandMars = new RoverCommand(__dirname + '/data/commands1.txt')
    await RoverCommandMars.deploy()
    await RoverCommandMars.move()

    const rovers = RoverCommandMars.getRovers()
    assert.equal(rovers['Rover 1'].getCoordinates(), '1 3 E')
    assert.equal(rovers['Rover 2'].getCoordinates(), '5 1 E')
  })
  it(`_parse()'`, () => {
    const RoverCommandMars = new RoverCommand(__dirname + '/data/commands1.txt')
    assert.equal(RoverCommandMars.instructions[0].name, 'Rover 1')
    assert.equal(RoverCommandMars.instructions[0].deployZone[0], 1)
    assert.equal(RoverCommandMars.instructions[0].deployZone[1], 2)
    assert.equal(RoverCommandMars.instructions[0].deployZone[2], 'N')
    assert.equal(RoverCommandMars.instructions[1].deployZone[0], 3)
    assert.equal(RoverCommandMars.instructions[1].deployZone[1], 3)
    assert.equal(RoverCommandMars.instructions[1].deployZone[2], 'E')
  })
})
