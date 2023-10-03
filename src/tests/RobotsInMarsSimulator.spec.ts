import RobotsInMarsSimulator from "../simulator/RobotsInMarsSimulator"
import { Direction, RobotInstruction } from "../simulator/types"

describe("When there is one robot and it does not move",  () => {  
  it("should return the same position when no instructions received", async () => {
    const simulator = new RobotsInMarsSimulator({
      width: 2,
      height: 2,
    }, [
      {
        initialPosition: { x: 0, y: 0, direction: Direction.North },
        instructions: []
      },
    ])
    const finalPositions = simulator.run()
    expect(finalPositions).toEqual([ { x: 0, y: 0, direction: Direction.North, isLost: false } ])
  })
})

describe("When there is one robot and it only turns",  () => {  
  it("should return correct position when it does a 90 degrees turn", async () => {
    const simulator = new RobotsInMarsSimulator({
      width: 2,
      height: 2,
    }, [
      {
        initialPosition: { x: 0, y: 0, direction: Direction.North },
        instructions: [
          RobotInstruction.Turn_90_Degress_Left,          
        ]
      },
    ])
    const finalPositions = simulator.run()
    expect(finalPositions).toEqual([ { x: 0, y: 0, direction: Direction.West, isLost: false } ])
  })

  it("should return the same position but the opposite direction after doing a 270 rotation", async () => {
    const simulator = new RobotsInMarsSimulator({
      width: 2,
      height: 2,
    }, [
      {
        initialPosition: { x: 0, y: 0, direction: Direction.North },
        instructions: [
          RobotInstruction.Turn_90_Degress_Left,
          RobotInstruction.Turn_90_Degress_Left,
          RobotInstruction.Turn_90_Degress_Left,
        ]
      },
    ])
    const finalPositions = simulator.run()
    expect(finalPositions).toEqual([ { x: 0, y: 0, direction: Direction.East, isLost: false } ])
  })

  it("should return the same position when the robot does a 360 rotation.", async () => {
    const simulator = new RobotsInMarsSimulator({
      width: 2,
      height: 2,
    }, [
      {
        initialPosition: { x: 0, y: 0, direction: Direction.North },
        instructions: [
          RobotInstruction.Turn_90_Degress_Left,
          RobotInstruction.Turn_90_Degress_Left,
          RobotInstruction.Turn_90_Degress_Left,
          RobotInstruction.Turn_90_Degress_Left,
        ]
      },
    ])
    const finalPositions = simulator.run()
    expect(finalPositions).toEqual([ { x: 0, y: 0, direction: Direction.North, isLost: false } ])
  })
})

describe("When there is one robot and it only moves",  () => {  
  it("should return the correct position when no instructions received", async () => {
    const simulator = new RobotsInMarsSimulator({
      width: 2,
      height: 2,
    }, [
      {
        initialPosition: { x: 0, y: 0, direction: Direction.North },
        instructions: [
          RobotInstruction.Move_Forward,
          RobotInstruction.Move_Forward
        ]
      },
    ])
    const finalPositions = simulator.run()
    expect(finalPositions).toEqual([ { x: 0, y: 2, direction: Direction.North, isLost: false } ])
  })
})

describe("When there is one robot and it moves and turns",  () => {  
  it("should return the correct position and direction after finishing its trip", async () => {
    const simulator = new RobotsInMarsSimulator({
      width: 5,
      height: 5,
    }, [
      {
        initialPosition: { x: 2, y: 3, direction: Direction.North },
        instructions: [          
          RobotInstruction.Move_Forward,
          RobotInstruction.Turn_90_Degress_Right,
          RobotInstruction.Move_Forward,
          RobotInstruction.Move_Forward,
          RobotInstruction.Turn_90_Degress_Right,
          RobotInstruction.Move_Forward,          
          RobotInstruction.Turn_90_Degress_Right,
          RobotInstruction.Move_Forward,
          RobotInstruction.Move_Forward,
          RobotInstruction.Turn_90_Degress_Left,
          RobotInstruction.Move_Forward,
          RobotInstruction.Move_Forward,
        ]
      },
    ])
    const finalPositions = simulator.run()
    expect(finalPositions).toEqual([ { x: 2, y: 1, direction: Direction.South, isLost: false } ])
  })
})

