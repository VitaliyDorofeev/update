/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
/* eslint-disable react/no-array-index-key */
import { useState, useEffect, useMemo } from 'react';
import { ClipLoader } from 'react-spinners';
import Select from '../Select';
import useFetchData from '../../hooks/UseFetchData';

function PopulateForm({ onChange }) {
  const { loading, formData } = useFetchData('Sheet1!A3:F');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedTradingNetwork, setSelectedTradingNetwork] = useState('');
  const [selectedReturnPoint, setSelectedReturnPoint] = useState('');
  const [selectTarif, setSelectTarif] = useState('');

  const uniqueRegions = useMemo(
    () => Array.from(
      new Set(
        formData.regions.filter(
          (region) => typeof region === 'string' && region.trim() !== '',
        ),
      ),
    ),
    [formData.regions],
  );

  const uniqueTradingNetworks = useMemo(() => {
    const filteredTradingNetworks = formData.tradingNetworks.filter(
      (_, index) => formData.regions[index] === selectedRegion,
    );
    return Array.from(new Set(filteredTradingNetworks));
  }, [formData.tradingNetworks, selectedRegion]);

  const uniqueReturnPoints = useMemo(() => {
    const filteredReturnPoints = formData.returnPoints.filter(
      (_, index) => formData.regions[index] === selectedRegion
        && formData.tradingNetworks[index] === selectedTradingNetwork,
    );
    return Array.from(new Set(filteredReturnPoints));
  }, [formData.returnPoints, selectedRegion, selectedTradingNetwork]);

  const uniquePlnList = useMemo(() => {
    const filteredPlnList = formData.plnListData.filter(
      (_, index) => formData.returnPoints[index] === selectedReturnPoint
        && formData.tradingNetworks[index] === selectedTradingNetwork,
    );
    return Array.from(new Set(filteredPlnList));
  }, [formData.plnListData, selectedReturnPoint, selectedTradingNetwork]);

  const uniqueRcsList = useMemo(() => {
    const filteredRcsList = formData.rcsListData.filter(
      (_, index) => formData.returnPoints[index] === selectedReturnPoint
        && formData.tradingNetworks[index] === selectedTradingNetwork,
    );
    return Array.from(new Set(filteredRcsList));
  }, [formData.rcsListData, selectedReturnPoint, selectedTradingNetwork]);

  const uniqueTarifList = useMemo(() => {
    const filteredTarifList = formData.tarifListData.filter(
      (_, index) => formData.returnPoints[index] === selectedReturnPoint
        && formData.tradingNetworks[index] === selectedTradingNetwork,
    );
    return Array.from(new Set(filteredTarifList));
  }, [formData.tarifListData, selectedReturnPoint, selectedTradingNetwork]);

  const handleInputChange = (type, value) => {
    switch (type) {
      case 'region':
        setSelectedRegion(value);
        onChange(type, value);
        setSelectedTradingNetwork('');
        setSelectedReturnPoint('');
        break;
      case 'tradingNetwork':
        setSelectedTradingNetwork(value);
        onChange(type, value);
        setSelectedReturnPoint('');
        break;
      case 'returnPoint':
        setSelectedReturnPoint(value);
        onChange(type, value);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (uniqueTarifList.length > 0 && selectTarif !== uniqueTarifList[0]) {
      const tarif = uniqueTarifList[0];
      setSelectTarif(tarif);
      onChange('tarif', tarif);
    }
  }, [uniqueTarifList]);

  return (
    <div>
      {loading ? (
        <div className="loader-container">
          <ClipLoader color="#123abc" size={150} />
        </div>
      ) : (
        <>
          <div className="pallet-return-form__group">
            <Select
              id="region"
              value={selectedRegion}
              onChange={(e) => handleInputChange('region', e.target.value)}
              options={uniqueRegions}
              placeholder="Выберите регион"
            />
            <Select
              id="trading-network"
              value={selectedTradingNetwork}
              onChange={(e) => handleInputChange('tradingNetwork', e.target.value)}
              options={uniqueTradingNetworks}
              placeholder="Выберите торговую сеть"
              disabled={!selectedRegion}
            />
            <Select
              id="return-point"
              value={selectedReturnPoint}
              onChange={(e) => handleInputChange('returnPoint', e.target.value)}
              options={uniqueReturnPoints}
              placeholder="Выберите точку возврата"
              disabled={!selectedTradingNetwork}
            />
          </div>

          <div className="pallet-return-form__group">
            <Select
              id="pln"
              value={uniquePlnList[0]}
              options={uniquePlnList}
              placeholder="PLN"
              className="custom-select--mod"
              disabled
            />
            <Select
              id="rcs"
              value={uniqueRcsList[0]}
              options={uniqueRcsList}
              placeholder="РЦ"
              className="custom-select--mod"
              disabled
            />
            <Select
              id="tarif"
              value={selectTarif}
              options={uniqueTarifList}
              placeholder="Тариф"
              className="custom-select--mod"
              disabled
            />
          </div>
        </>
      )}
    </div>
  );
}

export default PopulateForm;
