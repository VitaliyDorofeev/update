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

  const {
    uniqueRegions,
    uniqueTradingNetworks,
    uniqueReturnPoints,
    uniquePlnList,
    uniqueRcsList,
    uniqueTarifList,
  } = useMemo(() => {
    const regionsSet = new Set();
    const tradingNetworksSet = new Set();
    const returnPointsSet = new Set();
    const plnListSet = new Set();
    const rcsListSet = new Set();
    const tarifListSet = new Set();

    formData.regions.forEach((region, index) => {
      if (typeof region === 'string' && region.trim() !== '') {
        regionsSet.add(region);
      }

      if (formData.regions[index] === selectedRegion) {
        tradingNetworksSet.add(formData.tradingNetworks[index]);
      }

      if (
        formData.regions[index] === selectedRegion
        && formData.tradingNetworks[index] === selectedTradingNetwork
      ) {
        returnPointsSet.add(formData.returnPoints[index]);
      }

      if (
        formData.returnPoints[index] === selectedReturnPoint
        && formData.tradingNetworks[index] === selectedTradingNetwork
      ) {
        plnListSet.add(formData.plnListData[index]);
        rcsListSet.add(formData.rcsListData[index]);
        tarifListSet.add(formData.tarifListData[index]);
      }
    });

    return {
      uniqueRegions: Array.from(regionsSet),
      uniqueTradingNetworks: Array.from(tradingNetworksSet),
      uniqueReturnPoints: Array.from(returnPointsSet),
      uniquePlnList: Array.from(plnListSet),
      uniqueRcsList: Array.from(rcsListSet),
      uniqueTarifList: Array.from(tarifListSet),
    };
  }, [formData, selectedRegion, selectedTradingNetwork, selectedReturnPoint]);

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
