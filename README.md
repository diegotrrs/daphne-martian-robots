# Coding Challenge: Martian Robots Simulator 🤖 🔴
This repository includes the code for Daphne's coding challenge. It's a simulator of robots moving (and falling off) the surface of Mars. Check out the [Problem Description](./ProblemDescription.pdf) for all the details.


# How to run

Run the following commands
```
npm run build && npm run start
```

Using nodemon (dev mode)
```
npm run dev
```

# How to test

## 1. Using RobotsInMarsAppTextFileVersion
There is an example of an App that uses the Simulator and reads the configuration from a text file and outputs the results to another text file. By default
the input file is ```./file_input.txt``` and the output file is ```./file_output.txt```. You can edit the contents of the input file and run 
the following command again

```
npm run build && npm run start
```

It's important to understand the distinction between the "App" and the "Simulator".

Simulator: Contains all the logic related to moving robots on Mars. It, however, does not handle or have knowledge about the presentation or format o
f the input/output data.

App: Handles the presentation and formatting of the input/output data. It leverages the logic provided by the Simulator.
This separation of concerns provides flexibility, allowing us to create different types of Apps using the same Simulator, such as a potential Rest API App in the future.

## 2. Unit Tests
You can run the unit tests using the following command.

```
npm run test
```


# How to add new Instructions

The separation between Instruction and the Simulator provides flexibility when creating future instructions. For example, to include a new instruction that makes the robot move backwards you would need to do the following:

```typescript
// In /src/simulator/types.ts
// Add the new id

export enum RobotInstructionId {
  Turn_90_Degress_Right = "R",
  Turn_90_Degress_Left = "L",
  Move_Forward = "F",
  Move_Backward = "B", // This is the new id
}

```

```typescript
// In src/simulator/robotInstructions.ts
// Implement the new class

export class MoveBackward implements Instruction {
  id: RobotInstructionId = RobotInstructionId.Move_Backward
  
  execute(coordinates: Coordinates, degrees: number){
    const newCoordinates = { ...coordinates }
    switch (degrees) {
      case 0:
        newCoordinates.y -= 1
        break
      case 90:
        newCoordinates.x -= 1
        break
      case 180:
        newCoordinates.y += 1
        break
      case 270:
        newCoordinates.x += 1
        break
    }

    return {
      coordinates: newCoordinates,
      degrees,
    }
  }
}

```

```typescript
// In src/simulator/RobotsInMarsSimulator.ts
// Add the new Instruction to the list of valid instructions

// Note: This could be injected instead of existing in the  RobotsInMarsSimulator class
  private instructions = [
    new MoveForward(),
    new Turn90DegreesRight(),
    new Turn90DegreesLeft(),
    new MoveBackward() // new
  ]
```

...And that's it, your robots will then be able to fall off backwards.

