import { useCallback, useState } from "react";
import { seconds, TIME_UNITS, TimeUnits, type TimeUnit } from "time2time";
import { Meteors } from "./components/meteors/meteors";
import styles from "./time-2-time.module.css";

const asNumberInput = (value: number) => (isNaN(value) ? "" : value);

const isUnit = (value: string): value is TimeUnit =>
  TIME_UNITS.some((unit) => unit === value);

type Value = {
  value: number;
  unit: TimeUnit;
};

export function Time2Time() {
  const [firstValue, setFirstValue] = useState<Value>({
    value: 60,
    unit: "sec",
  });
  const [secondValue, setSecondValue] = useState<Value>({
    value: seconds(firstValue.value).to("min"),
    unit: "min",
  });

  const onChange = useCallback(
    (value: number | string, type: "first" | "second") => {
      const targetValue =
        typeof value === "number"
          ? value
          : type === "first"
            ? firstValue.value
            : secondValue.value;

      const targetUnit =
        typeof value === "number"
          ? type === "first"
            ? firstValue.unit
            : secondValue.unit
          : value;

      if (!isUnit(targetUnit)) return;

      (type === "first" ? setFirstValue : setSecondValue)((current) => ({
        ...current,
        [typeof value === "number" ? "value" : "unit"]: value,
      }));

      (type === "first" ? setSecondValue : setFirstValue)((current) => ({
        ...current,
        value: isNaN(targetValue)
          ? NaN
          : TimeUnits[targetUnit].to(targetValue, TimeUnits[current.unit]),
      }));
    },
    [firstValue, secondValue],
  );

  return (
    <main>
      <section className={styles.wrapper}>
        {Array.from({ length: 3 }, (_, index) =>
          index === 1 ? (
            <span />
          ) : (
            <div className={styles.input}>
              <input
                type="number"
                value={asNumberInput(
                  index === 0 ? firstValue.value : secondValue.value,
                )}
                onChange={(event) =>
                  onChange(
                    event.currentTarget.valueAsNumber,
                    index === 0 ? "first" : "second",
                  )
                }
              />

              <select
                value={index === 0 ? firstValue.unit : secondValue.unit}
                onChange={(event) =>
                  onChange(
                    event.currentTarget.value,
                    index === 0 ? "first" : "second",
                  )
                }
              >
                {TIME_UNITS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          ),
        )}
      </section>

      <Meteors />
    </main>
  );
}
