export default class CLIUtil {
  /**
   * Gets the value of command line argument
   * @param argumentName 
   * @returns 
   */
  public static getValueOf(argumentName: string): string {
    const argv = process.argv[2];
    if (argv === undefined) {
      throw new Error(`${argumentName} is not defined, please send ${argumentName} through CLI`);
    }
    if (argv.toUpperCase().includes(argumentName)) {
      return argv.split("=")[1]; 
    } 
      throw new Error(`Please send command line argument ${argumentName} with value`);
  }
}
