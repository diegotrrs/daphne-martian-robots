import { MoveForwards, Turn90DegreesLeft, Turn90DegreesRight } from "./robotInstructions"
import { Coordinates, DirectionId, RobotFinalPosition, RobotInitialPosition, RobotInstructionId, RobotMovementInformation } from "./types"

export enum CellState {
  CLEAN = 0,
  SCENTED = 1
}

const MAX_COORDINATE = 50

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
    new MoveForwards(),
    new Turn90DegreesRight(),
    new Turn90DegreesLeft(),
  ]

  constructor(topRightCoordinates: Coordinates, robotsMovementInformation: RobotMovementInformation []){
    this.createMarsGrid(topRightCoordinates.x + 1, topRightCoordinates.y + 1)    
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

  public getGridCellState(x: number, y: number): CellState {
    return this.grid[x][y]
  }

  private executeRobotInstructions(initialPosition: RobotInitialPosition, instructions: RobotInstructionId []){
    let { x: currentX, y: currentY } = initialPosition.coordinates
    let currentDegrees = degreesPerDirection[initialPosition.direction]
    const gridHeight = this.grid.length
    const gridWidth = this.grid[0].length
    let isLost = false

    if (initialPosition.coordinates.x > MAX_COORDINATE) {
      throw new Error(`x coordinate provided (${initialPosition.coordinates.x}) is above the accepted limit (${MAX_COORDINATE}) `)
    }

    if (initialPosition.coordinates.y > MAX_COORDINATE) {
      throw new Error(`y coordinate provided (${initialPosition.coordinates.y}) is above the accepted limit (${MAX_COORDINATE}) `)
    }

    for (const instructionId of instructions) {
      const instruction = this.instructions.find(instruction => instruction.id === instructionId)

      if (!instruction) throw new Error("Instruction not found")

      // Ignore the rest of the instructions if the robot got lost previously
      if (isLost){
        break
      }

      const results = instruction.execute({ x: currentX, y: currentY }, currentDegrees)
      
      // Update degrees
      currentDegrees = results.degrees

      const isTheRobotStandingOnScentedCell  = this.grid[currentX][currentY] === CellState.SCENTED
  
      const wouldRobotFallFromtheNorthSide = results.coordinates.y >= gridHeight
      const wouldRobotFallFromtheSouthSide = results.coordinates.y < 0
      const wouldRobotFallFromtheEastSide = results.coordinates.x >= gridWidth
      const wouldRobotFallFromtheWestSide = results.coordinates.x < 0
      const wouldRobotFall = wouldRobotFallFromtheNorthSide || wouldRobotFallFromtheSouthSide || wouldRobotFallFromtheEastSide || wouldRobotFallFromtheWestSide

      if (isTheRobotStandingOnScentedCell && wouldRobotFall){        
        continue
      }

      if (wouldRobotFall){
        this.grid[currentX][currentY] = CellState.SCENTED
        isLost = true

        // Leave the robot in the last save position
        if (wouldRobotFallFromtheNorthSide){
          currentY = gridHeight - 1
        } else if (wouldRobotFallFromtheSouthSide) {
          currentY = 0
        } else if (wouldRobotFallFromtheEastSide) {
          currentX = gridWidth - 1
        } else if (wouldRobotFallFromtheWestSide){
          currentX = 0
        }

      } else {
        currentX = results.coordinates.x
        currentY = results.coordinates.y
      }
    }

    return {
      coordinates: {
        x: currentX,
        y: currentY,
      },      
      direction: this.getDirectionFromDegree(currentDegrees) as DirectionId,
      isLost,
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
  
  /**
   * Iterates over all of the movement instructions for all robots and executes them.
   * @returns A list of Final positions for all robots
   */
  public run(): RobotFinalPosition[] {
    const finalPositions: RobotFinalPosition [] = []

    this.robotsMovementInformation.forEach((robotMovement) => {
      const { initialPosition, instructions } = robotMovement

      const finalPosition = this.executeRobotInstructions(initialPosition, instructions)
      finalPositions.push(finalPosition)
    })
    return finalPositions
  }
}

export default RobotsInMarsSimulator