import { Direction, GridDimensions, RobotFinalPosition, RobotInitialPosition, RobotInstruction, RobotMovementInformation } from "./types"

enum CellState {
  CLEAN = 0,
  SCENTED = 1
}

const degreesPerTurn = {
  [RobotInstruction.Turn_90_Degress_Right]: 90,
  [RobotInstruction.Turn_90_Degress_Left]: -90,
}

const degreesPerDirection = {
  [Direction.North]: 0,
  [Direction.East]: 90,
  [Direction.South]: 180,
  [Direction.West]: 270,
}

/**
 * Represents a simulator for Robots in Mars. The surface of Mars corresponds to a grid of the dimensions specified in gridDimensions.
 * The initial position and instructions for each robot are represented by robotsMovementInformation.
 * The run method uses this information to calculate the robots final positions.
 */
class RobotsInMarsSimulator {
  private robotsMovementInformation: RobotMovementInformation [] = []
  private grid: CellState [][] = []

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

  private executeRobotInstructions(initialPosition: RobotInitialPosition, instructions: RobotInstruction []){
    const { x, y, direction } = initialPosition    
    let newX = x, newY = y
    let currentRotation = degreesPerDirection[direction]
    
    instructions.forEach(instruction => {
      if(instruction === RobotInstruction.Move_Forward){
        switch (currentRotation) {
          case 0:
            newY += 1
            break;
          case 90:
            newX += 1
            break;
          case 180:
            newY -= 1
            break;
          case 270:
            newX -= 1
            break;
        }
      } else {
        currentRotation += degreesPerTurn[instruction]
      }
     
      // Ensure currentRotation stays within 0-359 range.  
      currentRotation = (currentRotation + 360) % 360;     
    });

    return {
      x: newX,
      y: newY,
      direction: this.getDirectionFromDegree(currentRotation) as Direction,
      isLost: false,
    }
  }

  private getDirectionFromDegree(degree: number) {
    for (const [direction, value] of Object.entries(degreesPerDirection)) {
      if (value === degree) {
        return direction;
      }
    }
    throw new Error(`Degree ${degree} not found in degreesPerDirection.`);
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