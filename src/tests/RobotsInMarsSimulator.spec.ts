import RobotsInMarsSimulator, { CellState } from "../simulator/RobotsInMarsSimulator"
import { DirectionId, RobotFinalPosition, RobotInstructionId } from "../simulator/types"

describe("When there is one robot and it does NOT MOVE OR TURN",  () => {  
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

describe("When there is one robot and it ONLY TURNS",  () => {  
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

describe("When there is one robot and it ONLY MOVES",  () => {  
  it("should return the correct position when only moving forward", async () => {
    const simulator = new RobotsInMarsSimulator({
      width: 3,
      height: 3,
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

describe("When there is one robot and it around moving back to its original position",  () => {  
  it("should return the correct position when only moving forward", async () => {
    const simulator = new RobotsInMarsSimulator({
      width: 6,
      height: 4,
    }, [
      {
        initialPosition: { coordinates: { x: 1, y: 1 }, direction: DirectionId.East },
        instructions: [
          RobotInstructionId.Turn_90_Degress_Right,
          RobotInstructionId.Move_Forward,
          RobotInstructionId.Turn_90_Degress_Right,
          RobotInstructionId.Move_Forward,
          RobotInstructionId.Turn_90_Degress_Right,
          RobotInstructionId.Move_Forward,
          RobotInstructionId.Turn_90_Degress_Right,
          RobotInstructionId.Move_Forward,
        ],
      },
    ])
    const finalPositions = simulator.run()
    expect(finalPositions).toEqual([ { coordinates: { x: 1, y: 1 }, direction: DirectionId.East, isLost: false } ])
  })
})


describe("When there is one robot and it MOVES AND TURNS",  () => {  
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

describe("When a robot FALLS off from the NORTH SIDE",  () => {
  let simulator: RobotsInMarsSimulator

  const gridDimensions = {
    width: 5,
    height: 5,
  }

  beforeEach(() => {
    simulator = new RobotsInMarsSimulator(gridDimensions, [
      {
        initialPosition: { coordinates: { x: 4, y: 4 }, direction: DirectionId.North },
        instructions: [          
          RobotInstructionId.Move_Forward,
        ],
      },
    ])
  })

  it("should mark the robot as lost and leave it in the last safe position", async () => {
    const finalPositions = simulator.run()
    expect(finalPositions).toEqual([ { coordinates: { x: 4, y: 4 }, direction: DirectionId.North, isLost: true } ])
  })

  it("should mark the grid cell was with scent", async () => {
    simulator.run()
    expect(simulator.getGridCellState(4,4)).toEqual(CellState.SCENTED)
  })
})

describe("When a robot FALLS off from the SOUTH side",  () => {
  let simulator: RobotsInMarsSimulator

  const gridDimensions = {
    width: 5,
    height: 5,
  }

  beforeEach(() => {
    simulator = new RobotsInMarsSimulator(gridDimensions, [
      {
        initialPosition: { coordinates: { x: 4, y: 0 }, direction: DirectionId.South },
        instructions: [
          RobotInstructionId.Move_Forward,
        ],
      },
    ])
  })

  it("should mark the robot as lost and leave it in the last safe position", async () => {
    const finalPositions = simulator.run()
    expect(finalPositions).toEqual([ { coordinates: { x: 4, y: 0 }, direction: DirectionId.South, isLost: true } ])
  })

  it("should mark the grid cell was with scent", async () => {
    simulator.run()
    expect(simulator.getGridCellState(4,0)).toEqual(CellState.SCENTED)
  })
})

describe("When a robot FALLS off from the EAST side",  () => {
  let simulator: RobotsInMarsSimulator

  const gridDimensions = {
    width: 5,
    height: 5,
  }

  beforeEach(() => {
    simulator = new RobotsInMarsSimulator(gridDimensions, [
      {
        initialPosition: { coordinates: { x: 4, y: 2 }, direction: DirectionId.East },
        instructions: [
          RobotInstructionId.Move_Forward,
        ],
      },
    ])
  })

  it("should mark the robot as lost and leave it in the last safe position", async () => {
    const finalPositions = simulator.run()
    expect(finalPositions).toEqual([ { coordinates: { x: 4, y: 2 }, direction: DirectionId.East, isLost: true } ])
  })

  it("should mark the grid cell was with scent", async () => {
    simulator.run()
    expect(simulator.getGridCellState(4,2)).toEqual(CellState.SCENTED)
  })
})

describe("When a robot FALLS off from the WEST side",  () => {
  let simulator: RobotsInMarsSimulator

  const gridDimensions = {
    width: 5,
    height: 5,
  }

  beforeEach(() => {
    simulator = new RobotsInMarsSimulator(gridDimensions, [
      {
        initialPosition: { coordinates: { x: 0, y: 1 }, direction: DirectionId.West },
        instructions: [
          RobotInstructionId.Move_Forward,
        ],
      },
    ])
  })

  it("should mark the robot as lost and leave it in the last safe position", async () => {
    const finalPositions = simulator.run()
    expect(finalPositions).toEqual([ { coordinates: { x: 0, y: 1 }, direction: DirectionId.West, isLost: true } ])
  })

  it("should mark the grid cell was with scent", async () => {
    simulator.run()
    expect(simulator.getGridCellState(0,1)).toEqual(CellState.SCENTED)
  })
})

describe("When ONE robot FALLS off and ANOTHER one tries to fall",  () => {
  let simulator: RobotsInMarsSimulator
  let finalPositions: RobotFinalPosition [] = []

  const gridDimensions = {
    width: 6,
    height: 4,
  }

  beforeEach(() => {
    simulator = new RobotsInMarsSimulator(gridDimensions, [
      {
        initialPosition: { coordinates: { x: 3, y: 2 }, direction: DirectionId.North },
        instructions: [
          // FRRFLLFFRRFLL          
          RobotInstructionId.Move_Forward,
          RobotInstructionId.Turn_90_Degress_Right,
          RobotInstructionId.Turn_90_Degress_Right,
          RobotInstructionId.Move_Forward,
          RobotInstructionId.Turn_90_Degress_Left,
          RobotInstructionId.Turn_90_Degress_Left,
          RobotInstructionId.Move_Forward,
          RobotInstructionId.Move_Forward,
          RobotInstructionId.Turn_90_Degress_Right,
          RobotInstructionId.Turn_90_Degress_Right,
          RobotInstructionId.Move_Forward,
          RobotInstructionId.Turn_90_Degress_Left,
          RobotInstructionId.Turn_90_Degress_Left,
        ],
      },
      {
        // LLFFFLFLFL
        initialPosition: { coordinates: { x: 0, y: 3 }, direction: DirectionId.West },
        instructions: [
          RobotInstructionId.Turn_90_Degress_Left,
          RobotInstructionId.Turn_90_Degress_Left,
          RobotInstructionId.Move_Forward,
          RobotInstructionId.Move_Forward,
          RobotInstructionId.Move_Forward,
          RobotInstructionId.Turn_90_Degress_Left,

          // This one will be ignored
          RobotInstructionId.Move_Forward,

          // This one will not be ignore
          RobotInstructionId.Turn_90_Degress_Left,
          RobotInstructionId.Move_Forward,
          RobotInstructionId.Turn_90_Degress_Left,
        ],
      },
    ])
    finalPositions = simulator.run()
  })

  it("should mark the first robot as lost and leave it in the last safe position", async () => {    
    expect(finalPositions[0]).toEqual({ coordinates: { x: 3, y: 3 }, direction: DirectionId.North, isLost: true })
  })

  it("should mark the grid cell was with scent", async () => {    
    expect(simulator.getGridCellState(3,3)).toEqual(CellState.SCENTED)
  })

  it("should prevent the second robot to fall off", async () => {    
    expect(finalPositions[1]).toEqual({ coordinates: { x: 2, y: 3 }, direction: DirectionId.South, isLost: false })
  })

  it("should keep the grid cell as scented", async () => {    
    expect(simulator.getGridCellState(3,3)).toEqual(CellState.SCENTED)
  })
})
