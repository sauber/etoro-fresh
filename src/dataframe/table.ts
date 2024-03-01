type CellTypes = number | string | boolean | undefined | object;
type BorderSymbols = [string, string, string, string];
type Theme = {
  top: BorderSymbols;
  row: BorderSymbols;
  div: BorderSymbols;
  bot: BorderSymbols;
};

/** Markup text in ansi */
function ansi(
  style: "normal" | "bold" | "dim" | "italic" | "underline" | "strikethrough",
  text: string,
): string {
  const styles = [
    "normal",
    "bold",
    "dim",
    "italic",
    "underline",
    "strikethrough",
  ];
  const code = styles.indexOf(style);
  const _esc_seq = "\x1b[";
  return _esc_seq + code + "m" + text + _esc_seq + "0m";
}

/** Pretty render data as ascii table */
export class Table {
  /** Title of table */
  public title: string | null = null;

  /** Columns headers */
  public headers: string[] = [];

  /** Grid of data */
  public rows: CellTypes[][] = [];

  /** Border theme for narrow table */
  public readonly narrowTheme: Theme = {
    top: ["╔", "═", "╤", "╗"],
    row: ["║", " ", "│", "║"],
    div: ["╟", "─", "┼", "╢"],
    bot: ["╚", "═", "╧", "╝"],
  };

  /** Border theme for wide content */
  public readonly wideTheme: Theme = {
    top: ["╔═", "═", "═╤═", "═╗"],
    row: ["║ ", " ", " │ ", " ║"],
    div: ["╟─", "─", "─┼─", "─╢"],
    bot: ["╚═", "═", "═╧═", "═╝"],
  };

  public readonly roundTheme: Theme = {
    top: ["╭─", "─", "─┬─", "─╮"],
    row: ["│ ", " ", " │ ", " │"],
    div: ["├─", "─", "─┼─", "─┤"],
    bot: ["╰─", "─", "─┴─", "─╯"],
  };

  /** Set theme */
  public theme = this.wideTheme;

  /** Decide width of each column */
  private columnWidth(): number[] {
    const content = [this.headers, ...this.rows].filter((x) => x.length > 0);
    const size: number[] = content[0].map((s) => this.cast(s).length);
    for (const row of content.slice(1)) {
      for (let i = 0; i < size.length; i++) {
        const s = this.cast(row[i]).length;
        if (s > size[i]) size[i] = s;
      }
    }
    return size;
  }

  /** Render cell content as a string */
  private cast(content: CellTypes): string {
    if (typeof content === "object") return "obj";
    if (content !== undefined && typeof content.toString === "function") {
      return content.toString();
    } else return "";
  }

  /** Render table title */
  private renderTitle(): string {
    return "[ " + this.title + " ]";
  }

  /** Render top or bottom border, og horizontal divider */
  private renderLine(symbols: BorderSymbols): string {
    const c = this.columnWidth();
    return (
      symbols[0] +
      c.map((w) => symbols[1].repeat(w)).join(symbols[2]) +
      symbols[3]
    );
  }

  /** Render content of cell, pad as needed */
  private renderCell(
    content: CellTypes,
    cellWidth: number,
    isHeader = false,
  ): string {
    const str = this.cast(content);
    const rich: string = isHeader ? ansi("bold", str) : str; // Bold text
    const pad = cellWidth - str.length;
    const bl = this.theme.row[1];
    switch (typeof content) {
      case "number":
        return bl.repeat(pad) + rich;
      case "string":
        return rich + bl.repeat(pad);
      case "boolean":
      case "object":
        return (
          bl.repeat(Math.ceil(pad / 2)) +
          ansi("italic", str) +
          bl.repeat(Math.floor(pad / 2))
        );
      default:
        return bl.repeat(pad);
    }
  }

  /** Render a row of content */
  private renderRow(row: CellTypes[], isHeader = false): string {
    const sym = this.theme.row;
    const w = this.columnWidth();
    return (
      sym[0] +
      row.map((c, i) => this.renderCell(c, w[i], isHeader)).join(sym[2]) +
      sym[3]
    );
  }

  /** Combine all lines of table */
  toString(): string {
    const t: Theme = this.theme;
    const hasHeaders = this.headers.length > 0;
    const hasRows = this.rows.length > 0;
    return [
      this.title ? this.renderTitle() : "",
      hasHeaders || hasRows ? this.renderLine(t.top) : "",
      hasHeaders ? this.renderRow(this.headers, true) : "",
      hasHeaders && hasRows ? this.renderLine(t.div) : "",
      ...this.rows.map((r) => this.renderRow(r)),
      hasHeaders || hasRows ? this.renderLine(t.bot) : "",
    ]
      .filter((s) => s.length > 0)
      .join("\n");
  }
}
