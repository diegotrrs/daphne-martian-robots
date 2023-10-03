export enum RobotInstruction {
  Turn_90_Degress_Right = "R",
  Turn_90_Degress_Left = "L",
  Move_Forward = "F",
}

export enum Direction {
  North = "N",
  West = "W",
  South = "S",
  East = "E",
}

export type RobotMovementInformation = {
  initialPosition: RobotInitialPosition,
  instructions: RobotInstruction[],
}

export type RobotInitialPosition = {
  x: number,
  y: number,
  direction: Direction,  
}

export type RobotFinalPosition = RobotInitialPosition & {
  isLost: boolean,
}

export type GridDimensions = {
  width: number,
  height: number,
}
