import { useState, useEffect } from 'react';
import PopulateForm from '../components/PopulateForm';
import PalletButton from '../components/PalletButton';

const defaultForm = {
  region: '',
  tradingNetwork: '',
  returnPoint: '',
};

function Home() {
  const [form, setForm] = useState(defaultForm);
  const [isSumBlock, setIsSumBlock] = useState(false);

  const handleRegionChange = (value) => {
    setForm((prevForm) => ({ ...prevForm, region: value }));
  };

  const handleTradingChange = (value) => {
    setForm((prevForm) => ({ ...prevForm, tradingNetwork: value }));
  };

  const handleReturnPointChange = (value) => {
    setForm((prevForm) => ({ ...prevForm, returnPoint: value }));
  };

  useEffect(() => {
    const checkDataCompletion = () => {
      const isAllValuesTrue = Object.entries(form).every(([, value]) => !!value);

      if (isAllValuesTrue) {
        setIsSumBlock(true);
      } else {
        setIsSumBlock(false);
      }
    };

    checkDataCompletion();
  }, [form]);

  return (
    <main className="main">
      <div className="main__title">
        <h1 className="title">Возврат паллет</h1>
      </div>
      <form className="pallet-return-form">
        <PopulateForm
          onRegionChange={handleRegionChange}
          onTradingChange={handleTradingChange}
          onReturnPointChange={handleReturnPointChange}
        />

        {isSumBlock && (
          <div className="pallet-return-form__sum">
            <div className="pallet-return-form__group__input-wrapper">
              <span className="pallet-return-form__group__input-desc">Введите кол-во паллет (месяц) : </span>
              <input className="pallet-return-form__group__input" type="number" />
            </div>

            <PalletButton
              selectedRegion={form.region}
              selectedTradingNetwork={form.tradingNetwork}
              selectedReturnPoint={form.returnPoint}
            />
          </div>
        )}
      </form>
    </main>
  );
}

export default Home;
