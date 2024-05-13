/* eslint-disable react/button-has-type */
import { useState, useEffect } from 'react';

function PalletButton({ selectedRegion, selectedTradingNetwork, selectedReturnPoint }) {
  const [result, setResult] = useState('');

  const handleCalculate = (e) => {
    e.preventDefault();

    const selectedTarif = parseFloat(document.getElementById('tarif').value);
    const inputValue = parseFloat(document.querySelector('.pallet-return-form__group__input').value);

    // eslint-disable-next-line no-restricted-globals
    if (!isNaN(selectedTarif) && !isNaN(inputValue)) {
      const calculatedResult = selectedTarif * inputValue;
      setResult(`${new Intl.NumberFormat('ru-RU').format(calculatedResult)} Рублей в месяц`);
    } else {
      console.error('Ошибка: одно из значений не является числом');
      setResult('');
    }
  };

  // Сброс значений при изменении региона
  useEffect(() => {
    setResult('');
    const inputValue = document.querySelector('.pallet-return-form__group__input');
    inputValue.value = '';
  }, [selectedRegion, selectedTradingNetwork, selectedReturnPoint]);

  return (
    <>
      <span className="pallet-return-form__group__input pallet-return-form__group__input__check">{result}</span>
      <button className="pallet-return-form__group__btn btn" onClick={handleCalculate}>Рассчитать</button>
    </>
  );
}

export default PalletButton;
