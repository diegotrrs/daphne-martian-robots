export enum RobotInstructionId {
  Turn_90_Degress_Right = "R",
  Turn_90_Degress_Left = "L",
  Move_Forward = "F",
}

export enum DirectionId {
  North = "N",
  West = "W",
  South = "S",
  East = "E",
}

export type RobotMovementInformation = {
  initialPosition: RobotInitialPosition,
  instructions: RobotInstructionId[],
}

export type Coordinates = {
  x: number,
  y: number,
}

export type RobotInitialPosition = {
  coordinates: Coordinates,
  direction: DirectionId,  
}

export type RobotFinalPosition = RobotInitialPosition & {
  isLost: boolean,
}
