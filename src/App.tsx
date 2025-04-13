import { useState } from "react";
import "./index.css";
import Marker from "./Marker";
import { Label, TextLabel } from "./types";

const labels: Label[] = [
  { label: "ФИО", color: "#bbf7d0" },
  { label: "Дата", color: "#bfdbfe" },
  { label: "Тип", color: "#fecaca" },
];

const text = `Генеральному директору
ООО «Строй-Сервис М»
Иванчукову Д.Т.
крановщика
Ситдикова Л. Я.

Заявление.

Прошу предоставить мне ежегодный оплачиваемый отпуск
с «1» сентября 2016 г. по «28» сентября 2016 г.
сроком на 28 календарных дней.

_______________________/Ситдиков Л.Я./

15 августа 2016 г.`;

function App() {
  const [labeling, setLabeling] = useState<TextLabel[]>([]);

  return (
    <Marker
      labels={labels}
      text={text}
      labeling={labeling}
      onChange={setLabeling}
    />
  );
}

export default App;
