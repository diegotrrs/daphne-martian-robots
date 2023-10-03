import { GridDimensions, RobotFinalPosition, RobotMovementInformation } from "./types"

enum CellState {
  CLEAN = 0,
  SCENTED = 1
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

  public run(): RobotFinalPosition[]{
    return []
  }
}

export default RobotsInMarsSimulator