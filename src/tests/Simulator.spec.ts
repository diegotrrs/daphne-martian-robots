import Simulator from "../Simulator"

describe("First test case",  () => {
  test("First test case", async () => {
    const simulator = new Simulator()
    expect(simulator.start()).toEqual("Not implemented yet.")
  })
})
