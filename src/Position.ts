/**
 * The 1-indexed row and col of a character in a (possibly multiline) string.
 * Used for errors and debugging.
 */
export default class Position {
  public constructor(
    public readonly row: number,
    public readonly col: number
  ) { }
}