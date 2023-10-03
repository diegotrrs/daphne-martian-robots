import RobotsInMarsSimulator from "../simulator/RobotsInMarsSimulator"

describe("RobotsInMarsSimulator",  () => {
  test("Not implemented yet", async () => {
    const simulator = new RobotsInMarsSimulator({
      width: 2,
      height: 2,
    }, [])
    expect(simulator.run()).toEqual([])
  })
})
