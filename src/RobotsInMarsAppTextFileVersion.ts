import RobotsInMarsSimulator from "./simulator/RobotsInMarsSimulator"
import { DirectionId, GridDimensions, RobotFinalPosition, RobotInitialPosition, RobotInstructionId, RobotMovementInformation } from "./simulator/types"
import * as fs from 'fs/promises'

/**
 * Represents an App that simulates Robots in Mars using text files are input and output.
 */
class RobotsInMarsAppTextFileVersion {
  private inputFilePath: string
  private outputFilePath: string

  constructor(inputFilePath: string, outputFilePath: string){
    this.inputFilePath = inputFilePath
    this.outputFilePath = outputFilePath
  }

  public async start (){   
    const lines = await this.readInputFileContent(this.inputFilePath)

    if (!lines) throw Error('The entry file is empty.')
    
    const gridDimensions: GridDimensions = this.parseGridDimensions(lines[0])
    const robotsMovementInformation: RobotMovementInformation [] = []

    // Ignore the first line and populate the movement information for each robot.
    // The movement information for each group comes in two lines: the initial position and then the instructions.
    for (let i = 1; i < lines.length; i+= 2) {
      robotsMovementInformation.push(
        {
          initialPosition: this.parseRobotInitialPosition(lines[i]),
          instructions: this.parseRobotInstructions(lines[i + 1]),
        }
      )    
    }

    const simulator = new RobotsInMarsSimulator(gridDimensions, robotsMovementInformation)
    const finalPositions = simulator.run()
    await this.writeRobotsFinalPositions(this.outputFilePath, finalPositions)
  }

  private parseGridDimensions(input: string): GridDimensions {
    if (!/^\d+ \d+$/.test(input)) throw Error(`Incorrect format for dimensions. Input received ${input}. Excepted /^d+ d+$/`)
  
    const tokens = input.split(" ")
  
    return {
      width: parseInt(tokens[0]),
      height: parseInt(tokens[1]),
    }
  }

  private parseRobotInstructions(input: string): RobotInstructionId [] {
    const chars = [ ...input ]
    const validInstructions = Object.values(RobotInstructionId)
    for (const char of chars) {
      if (!validInstructions.includes(char as RobotInstructionId)) throw Error(`Incorrect format for robot instructions. Input received ${input}. Valid options ${validInstructions}`)
    }
  
    return chars as RobotInstructionId []
  }

  private parseRobotInitialPosition(input: string): RobotInitialPosition {
    const tokens = input.split(" ")
    const [ xCoordinate, yCoordinate, direction ] = tokens

    if (isNaN(Number(xCoordinate)) || isNaN(Number(yCoordinate))) throw Error(`Incorrect format for initial position. Input received ${input}. Excepted /^d+$/`)

    const validDirections = Object.values(DirectionId)

    if (!validDirections.includes(direction as DirectionId)) throw Error(`Incorrect format for directions. Input received ${input}. Valid options ${validDirections}`)
    
    return {
      coordinates: {
        x: Number.parseInt(xCoordinate),
        y: Number.parseInt(yCoordinate),
      },      
      direction: direction as DirectionId,
    }
  }

  private async readInputFileContent(filePath: string): Promise<string[]> {
    const data = await fs.readFile(filePath, 'utf-8')
    const lines = data.split('\n').map(line => line.trim())
    return lines           
  }

  private async writeRobotsFinalPositions(outputFilePath: string, positions: RobotFinalPosition[]) {    
    const finalPositionsText = positions.map(p => `${p.coordinates.x} ${p.coordinates.y} ${p.direction} ${p.isLost ? "LOST": ""}`)
    const content = finalPositionsText.join('\n')    
    await fs.writeFile(outputFilePath, content, 'utf8')
  }
}

export default RobotsInMarsAppTextFileVersion