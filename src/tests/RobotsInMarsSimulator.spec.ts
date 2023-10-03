import RobotsInMarsSimulator from "../simulator/RobotsInMarsSimulator"
import { DirectionId, RobotInstructionId } from "../simulator/types"

describe("When there is one robot and it does not move",  () => {  
  it("should return the same position when no instructions received", async () => {
    const simulator = new RobotsInMarsSimulator({
      width: 2,
      height: 2,
    }, [
      {
        initialPosition: { coordinates: { x: 0, y: 0 }, direction: DirectionId.North },
        instructions: [],
      },
    ])
    const finalPositions = simulator.run()
    expect(finalPositions).toEqual([ { coordinates: { x: 0, y: 0 }, direction: DirectionId.North, isLost: false } ])
  })
})

describe("When there is one robot and it only turns",  () => {  
  it("should return correct position when it does a 90 degrees turn", async () => {
    const simulator = new RobotsInMarsSimulator({
      width: 2,
      height: 2,
    }, [
      {
        initialPosition: { coordinates: { x: 0, y: 0 }, direction: DirectionId.North },
        instructions: [
          RobotInstructionId.Turn_90_Degress_Left,          
        ],
      },
    ])
    const finalPositions = simulator.run()
    expect(finalPositions).toEqual([ { coordinates: { x: 0, y: 0 }, direction: DirectionId.West, isLost: false } ])
  })

  it("should return the same position but the opposite direction after doing a 270 degrees rotation", async () => {
    const simulator = new RobotsInMarsSimulator({
      width: 2,
      height: 2,
    }, [
      {
        initialPosition: { coordinates: { x: 0, y: 0 }, direction: DirectionId.North },
        instructions: [
          RobotInstructionId.Turn_90_Degress_Left,
          RobotInstructionId.Turn_90_Degress_Left,
          RobotInstructionId.Turn_90_Degress_Left,
        ],
      },
    ])
    const finalPositions = simulator.run()
    expect(finalPositions).toEqual([ { coordinates: { x: 0, y: 0 }, direction: DirectionId.East, isLost: false } ])
  })

  it("should return the same position when the robot does a 360 degrees rotation.", async () => {
    const simulator = new RobotsInMarsSimulator({
      width: 2,
      height: 2,
    }, [
      {
        initialPosition: { coordinates: { x: 0, y: 0 }, direction: DirectionId.North },
        instructions: [
          RobotInstructionId.Turn_90_Degress_Left,
          RobotInstructionId.Turn_90_Degress_Left,
          RobotInstructionId.Turn_90_Degress_Left,
          RobotInstructionId.Turn_90_Degress_Left,
        ],
      },
    ])
    const finalPositions = simulator.run()
    expect(finalPositions).toEqual([ { coordinates: { x: 0, y: 0 }, direction: DirectionId.North, isLost: false } ])
  })
})

describe("When there is one robot and it only moves",  () => {  
  it("should return the correct position when only moving forward", async () => {
    const simulator = new RobotsInMarsSimulator({
      width: 2,
      height: 2,
    }, [
      {
        initialPosition: { coordinates: { x: 0, y: 0 }, direction: DirectionId.North },
        instructions: [
          RobotInstructionId.Move_Forward,
          RobotInstructionId.Move_Forward,
        ],
      },
    ])
    const finalPositions = simulator.run()
    expect(finalPositions).toEqual([ { coordinates: { x: 0, y: 2 }, direction: DirectionId.North, isLost: false } ])
  })
})

describe("When there is one robot and it moves and turns",  () => {  
  it("should return the correct position and direction after finishing its trip", async () => {
    const simulator = new RobotsInMarsSimulator({
      width: 5,
      height: 5,
    }, [
      {
        initialPosition: { coordinates: { x: 2, y: 3 }, direction: DirectionId.North },
        instructions: [          
          RobotInstructionId.Move_Forward,
          RobotInstructionId.Turn_90_Degress_Right,
          RobotInstructionId.Move_Forward,
          RobotInstructionId.Move_Forward,
          RobotInstructionId.Turn_90_Degress_Right,
          RobotInstructionId.Move_Forward,          
          RobotInstructionId.Turn_90_Degress_Right,
          RobotInstructionId.Move_Forward,
          RobotInstructionId.Move_Forward,
          RobotInstructionId.Turn_90_Degress_Left,
          RobotInstructionId.Move_Forward,
          RobotInstructionId.Move_Forward,
        ],
      },
    ])
    const finalPositions = simulator.run()
    expect(finalPositions).toEqual([ { coordinates: { x: 2, y: 1 }, direction: DirectionId.South, isLost: false } ])
  })
})

