import Simulator from "./Simulator"

class App {  
  constructor(){

  }

  start(){
    const simulator = new Simulator()
    console.log(simulator.start())
  }
}

export default App