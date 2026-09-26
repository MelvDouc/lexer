import Position from "$src/Position.ts";
import SpecialChars from "$src/SpecialChars.ts";

export default class Lexer {
  protected readonly input: string;
  protected index = 0;
  protected row = 1;
  protected col = 1;

  public constructor(input: string) {
    this.input = input;
  }

  /**
   * Get the input character at the current index.
   * Returns EOF if the index is greater than or equal to the input's length.
   */
  protected get current(): string {
    return this.index < this.input.length
      ? this.input[this.index]
      : SpecialChars.EOF;
  }

  protected get position(): Position {
    return new Position(this.row, this.col);
  }

  /**
   * Increment the current index and update the current row and col.
   * If a line feed is encountered, the row is incremented and the col is reset to 1.
   */
  protected advance(): void {
    if (this.current === SpecialChars.LineFeed) {
      this.row++;
      this.col = 1;
    } else {
      this.col++;
    }

    this.index++;
  }

  /**
   * Get a substring of consecutive characters that match a predicate.
   * @param predicate See {@link ScanPredicate}.
   */
  protected scanWhile(predicate: ScanPredicate): string {
    let output = "";
    let ch = this.current;

    while (ch !== SpecialChars.EOF && predicate(ch, output)) {
      output += ch;
      this.advance();
      ch = this.current;
    }

    return output;
  }
}

/**
 * Return whether the current character should be appended to the output string.
 * @param ch - The current character.
 * @param str - The concatenation of all the characters that matched this function so far.
 */
export type ScanPredicate = (ch: string, str: string) => boolean;
