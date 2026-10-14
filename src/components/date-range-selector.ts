import { LitElement, html } from "lit";
import { RANGE_MODES, isRangeMode, type RangeMode } from "../lib/date-range";

const selectClass =
  "rounded-[var(--radius-sm)] border border-[var(--color-border-default)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] outline-none transition focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand-ring)]";
const labelClass = "text-sm font-medium text-[var(--color-text-secondary)]";

export class DateRangeSelector extends LitElement {
  static properties = {
    month: { type: Number, attribute: false },
    year: { type: Number, attribute: false },
    rangeMode: { attribute: false },
  };

  declare month: number;
  declare year: number;
  declare rangeMode: RangeMode;

  constructor() {
    super();
    this.rangeMode = "month";
  }

  createRenderRoot() {
    return this;
  }

  private emitChange() {
    this.dispatchEvent(
      new CustomEvent("date-change", {
        detail: { month: this.month, year: this.year, rangeMode: this.rangeMode },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private handleRangeModeChange = (event: Event) => {
    const value = (event.target as HTMLSelectElement).value;
    if (!isRangeMode(value)) return;
    this.rangeMode = value;
    this.emitChange();
  };

  private handleMonthChange = (event: Event) => {
    this.month = parseInt((event.target as HTMLSelectElement).value, 10);
    this.emitChange();
  };

  private handleYearChange = (event: Event) => {
    this.year = parseInt((event.target as HTMLSelectElement).value, 10);
    this.emitChange();
  };

  render() {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    return html`
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label for="range-mode-select" class=${labelClass}>Range</label>
          <select id="range-mode-select" @change=${this.handleRangeModeChange} class=${selectClass}>
            ${RANGE_MODES.map(
              (m) => html`
                <option value=${m.value} ?selected=${this.rangeMode === m.value}>${m.label}</option>
              `,
            )}
          </select>
        </div>

        ${this.rangeMode === "year365"
          ? ""
          : html`
              <div class="flex gap-4">
                <div class="flex flex-col gap-2">
                  <label for="month-select" class=${labelClass}>
                    ${this.rangeMode === "quarter" ? "Ending month" : "Month"}
                  </label>
                  <select id="month-select" @change=${this.handleMonthChange} class=${selectClass}>
                    ${months.map(
                      (name, index) => html`
                        <option value=${index} ?selected=${this.month === index}>${name}</option>
                      `,
                    )}
                  </select>
                </div>

                <div class="flex flex-col gap-2">
                  <label for="year-select" class=${labelClass}>Year</label>
                  <select id="year-select" @change=${this.handleYearChange} class=${selectClass}>
                    ${years.map(
                      (y) => html` <option value=${y} ?selected=${this.year === y}>${y}</option> `,
                    )}
                  </select>
                </div>
              </div>
            `}
      </div>
    `;
  }
}

if (!customElements.get("date-range-selector")) {
  customElements.define("date-range-selector", DateRangeSelector);
}
