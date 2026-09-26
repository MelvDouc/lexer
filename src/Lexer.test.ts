import Lexer from "$src/Lexer.ts";
import type Position from "$src/Position.ts";
import SpecialChars from "$src/SpecialChars.ts";
import { assertEquals } from "@std/assert";

class TestLexer extends Lexer {
  public getCurrent(): string {
    return this.current;
  }

  public getIndex(): number {
    return this.index;
  }

  public getPosition(): Position {
    return this.position;
  }

  public goForward(): void {
    this.advance();
  }

  public get scan() {
    return this.scanWhile;
  }
}

Deno.test("row should be incremented on new line", () => {
  const firstLine = "line1";
  const input = `${firstLine}\nLine2`;
  const lexer = new TestLexer(input);

  while (lexer.getCurrent() !== "L")
    lexer.goForward();

  const { row, col } = lexer.getPosition();
  assertEquals(row, 2);
  assertEquals(col, 1);
});

Deno.test("EOF should be returned when input length is exceeded", () => {
  const input = Deno.readTextFileSync("deno.lock");
  const lexer = new TestLexer(input);

  while (lexer.getIndex() < input.length)
    lexer.goForward();

  assertEquals(lexer.getCurrent(), SpecialChars.EOF);
});

Deno.test("should be able to parse an escape double quote", () => {
  const expected = '...escaped double quote: \\".';
  const input = `${expected}" more text`;
  const lexer = new TestLexer(input);

  const actual = lexer.scan((ch, str) => ch !== '"' || str.at(-1) === "\\");
  assertEquals(actual, expected);
});