import { Coordinates, RobotInstructionId } from "./types"

/**
 * Represents an Instruction a robot can respond to. It receives the current coordinates and degrees of the robot and
 * it returns the new coordinates and degree. Some Instructions modify the degree other ones modify the coordinates.
 */
interface Instruction {
  id: RobotInstructionId,
  execute: (coordinates: Coordinates, degrees: number) => { coordinates: Coordinates, degrees: number },
}
export class MoveForward implements Instruction {
  id: RobotInstructionId = RobotInstructionId.Move_Forward
  
  execute(coordinates: Coordinates, degrees: number){
    const newCoordinates = { ...coordinates }
    switch (degrees) {
      case 0:
        newCoordinates.y += 1
        break
      case 90:
        newCoordinates.x += 1
        break
      case 180:
        newCoordinates.y -= 1
        break
      case 270:
        newCoordinates.x -= 1
        break
    }

    return {
      coordinates: newCoordinates,
      degrees,
    }
  }
}

export class Turn90DegreesRight implements Instruction {
  id: RobotInstructionId = RobotInstructionId.Turn_90_Degress_Right

  execute(coordinates: Coordinates, degrees: number){
    let newDegrees = degrees + 90

    // Ensures that we only get degrees between 0 and 360.
    // For example: 450 would be converted to converted to 90
    if (newDegrees >= 360){
      newDegrees = newDegrees % 360
    }

    return {
      coordinates,
      degrees: newDegrees,
    }
  }
}

export class Turn90DegreesLeft implements Instruction {
  id: RobotInstructionId = RobotInstructionId.Turn_90_Degress_Left
  execute(coordinates: Coordinates, degrees: number) {    
    let newDegrees = degrees - 90
  
    // Ensures that we only get degrees between 0 and 360.
    // For example: -90 would be converted to 270
    if (newDegrees < 0){
      newDegrees = 360 - Math.abs(newDegrees)
    }

    return {
      coordinates,
      degrees: newDegrees,
    }
  }
}