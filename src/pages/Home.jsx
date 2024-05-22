/* eslint-disable react/button-has-type */
/* eslint-disable no-restricted-globals */
import { useState, useEffect } from 'react';
import PopulateForm from '../components/PopulateForm';

const defaultForm = {
  region: '',
  tradingNetwork: '',
  returnPoint: '',
  tarif: '',
};

function Home() {
  const [form, setForm] = useState(defaultForm);
  const [isSumBlock, setIsSumBlock] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState('');

  const handleFormChange = (type, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      [type]: value,
    }));
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleCalculate = (e) => {
    e.preventDefault();

    const selectedTarif = parseFloat(form.tarif);
    const inputNumber = parseFloat(inputValue);

    if (!isNaN(selectedTarif) && !isNaN(inputNumber)) {
      const calculatedResult = selectedTarif * inputNumber;
      setResult(
        `${new Intl.NumberFormat('ru-RU').format(
          calculatedResult,
        )} Рублей в месяц`,
      );
    } else {
      console.error('Ошибка: одно из значений не является числом');
      setResult('');
    }
  };

  useEffect(() => {
    const checkDataCompletion = () => {
      const isAllValuesTrue = Object.values(form).every((value) => !!value);
      setIsSumBlock(isAllValuesTrue);
    };

    checkDataCompletion();
  }, [form]);

  useEffect(() => {
    setResult('');
    setInputValue('');
  }, [form.region, form.tradingNetwork, form.returnPoint]);

  return (
    <main className="main">
      <div className="main__title">
        <h1 className="title">Возврат паллет</h1>
      </div>
      <form className="pallet-return-form">
        <PopulateForm onChange={handleFormChange} />

        {isSumBlock && (
          <div className="pallet-return-form__sum">
            <div className="pallet-return-form__group__input-wrapper">
              <span className="pallet-return-form__group__input-desc">
                Введите кол-во паллет (месяц) :
                {' '}
              </span>
              <input
                className="pallet-return-form__group__input"
                type="number"
                value={inputValue}
                onChange={handleInputChange}
              />
            </div>

            <span className="pallet-return-form__group__input pallet-return-form__group__input__check">
              {result}
            </span>
            <button
              className="pallet-return-form__group__btn btn"
              onClick={handleCalculate}
            >
              Рассчитать
            </button>
          </div>
        )}
      </form>
    </main>
  );
}

export default Home;
