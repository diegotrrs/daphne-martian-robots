import { MoveForward, Turn90DegreesLeft, Turn90DegreesRight } from "./robotInstructions"
import { DirectionId, GridDimensions, RobotFinalPosition, RobotInitialPosition, RobotInstructionId, RobotMovementInformation } from "./types"

enum CellState {
  CLEAN = 0,
  SCENTED = 1
}

const degreesPerDirection = {
  [DirectionId.North]: 0,
  [DirectionId.East]: 90,
  [DirectionId.South]: 180,
  [DirectionId.West]: 270,
}

/**
 * Represents a simulator for Robots in Mars. The surface of Mars corresponds to a grid of the dimensions specified in gridDimensions.
 * The initial position and instructions for each robot are represented by robotsMovementInformation.
 * The run method uses this information to calculate the robots final positions.
 */
class RobotsInMarsSimulator {
  private robotsMovementInformation: RobotMovementInformation [] = []
  private grid: CellState [][] = []

  // All of the possible instructions robots can respond to
  private instructions = [
    new MoveForward(),
    new Turn90DegreesRight(),
    new Turn90DegreesLeft(),
  ]

  constructor(gridDimensions: GridDimensions, robotsMovementInformation: RobotMovementInformation []){
    this.createMarsGrid(gridDimensions.width, gridDimensions.height)
    this.robotsMovementInformation = robotsMovementInformation
  }

  private createMarsGrid(columns: number, rows: number) {
    for (let i = 0; i < rows; i++) {
      const row = []
      for (let j = 0; j < columns; j++) {
        row.push(CellState.CLEAN)
      }
      this.grid.push(row)
    }
  }

  private executeRobotInstructions(initialPosition: RobotInitialPosition, instructions: RobotInstructionId []){
    let { x: newX, y: newY } = initialPosition.coordinates
    let currentDegrees = degreesPerDirection[initialPosition.direction]
    
    instructions.forEach(instructionId => {
      const instruction = this.instructions.find(instruction => instruction.id === instructionId)
      
      if (!instruction) throw new Error("Instruction not found")

      const results = instruction.execute({ x: newX, y: newY }, currentDegrees)      
      newX = results.coordinates.x
      newY = results.coordinates.y
      currentDegrees = results.degrees
    })

    return {
      coordinates: {
        x: newX,
        y: newY,
      },      
      direction: this.getDirectionFromDegree(currentDegrees) as DirectionId,
      isLost: false,
    }
  }

  private getDirectionFromDegree(degree: number) {
    for (const [ direction, value ] of Object.entries(degreesPerDirection)) {
      if (value === degree) {
        return direction
      }
    }
    throw new Error(`Degree ${degree} not found in degreesPerDirection.`)
  }
  
  public run(): RobotFinalPosition[] {
    const finalPositions: RobotFinalPosition [] = []

    this.robotsMovementInformation.forEach(robotMovement => {
      const { initialPosition, instructions } = robotMovement

      const finalPosition = this.executeRobotInstructions(initialPosition, instructions)
      finalPositions.push(finalPosition)
    })
    return finalPositions
  }
}

export default RobotsInMarsSimulator