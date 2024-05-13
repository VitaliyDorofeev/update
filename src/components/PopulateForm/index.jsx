/* eslint-disable max-len */
/* eslint-disable react/no-array-index-key */
import { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';

const spreadsheetId = '1HUCYLt6G0gy7BKOXUpZQ-eM1KHTogk25KvD7MQEovvg';
const apiKey = 'AIzaSyAngsqkvSAnquqd4uHLIxBlHUD_kE5z6yU';

function fetchDataFromGoogleSheets(range) {
  return fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      if (data && data.values && data.values.length > 0) {
        return data.values;
      }
      throw new Error('Empty data or invalid format returned from Google Sheets');
    })
    .catch((error) => {
      console.error('Error fetching data from Google Sheets:', error);
      throw error;
    });
}

function useFetchData(range) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const values = await fetchDataFromGoogleSheets(range);
        setData(values);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, [range]);

  return { data, loading };
}

function PopulateForm({ onRegionChange, onTradingChange, onReturnPointChange }) {
  const { data, loading } = useFetchData('Sheet1!A3:F');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedTradingNetwork, setSelectedTradingNetwork] = useState('');
  const [selectedReturnPoint, setSelectedReturnPoint] = useState('');

  const regions = data.map((row) => row[0]);
  const tradingNetworks = data.map((row) => row[1]);
  const returnPoints = data.map((row) => row[2]);
  const plnListData = data.map((row) => row[3]);
  const rcsListData = data.map((row) => row[4]);
  const tarifListData = data.map((row) => row[5]);

  const uniqueRegions = Array.from(new Set(regions.filter((region) => typeof region === 'string' && region.trim() !== '')));

  const filteredTradingNetworks = tradingNetworks.filter((_, index) => regions[index] === selectedRegion);
  const uniqueTradingNetworks = Array.from(new Set(filteredTradingNetworks));

  const filteredReturnPoints = returnPoints.filter((_, index) => regions[index] === selectedRegion && tradingNetworks[index] === selectedTradingNetwork);
  const uniqueReturnPoints = Array.from(new Set(filteredReturnPoints));

  const filteredPlnList = plnListData.filter((_, index) => returnPoints[index] === selectedReturnPoint && tradingNetworks[index] === selectedTradingNetwork);
  const uniquePlnList = Array.from(new Set(filteredPlnList));

  const filteredRcsList = rcsListData.filter((_, index) => returnPoints[index] === selectedReturnPoint && tradingNetworks[index] === selectedTradingNetwork);
  const uniqueRcsList = Array.from(new Set(filteredRcsList));

  const filteredTarifList = tarifListData.filter((_, index) => returnPoints[index] === selectedReturnPoint && tradingNetworks[index] === selectedTradingNetwork);
  const uniqueTarifList = Array.from(new Set(filteredTarifList));

  const handleRegionChange = (event) => {
    const region = event.target.value;
    setSelectedRegion(region);
    onRegionChange(region);
    setSelectedTradingNetwork('');
    setSelectedReturnPoint('');
  };

  const handleTradingChange = (event) => {
    const tradingNetwork = event.target.value;
    setSelectedTradingNetwork(tradingNetwork);
    onTradingChange(tradingNetwork);
    setSelectedReturnPoint('');
  };

  const handleReturnPointChange = (event) => {
    const returnPoint = event.target.value;
    setSelectedReturnPoint(returnPoint);
    onReturnPointChange(returnPoint);
  };

  return (
    <div>
      {loading ? (
        <div className="loader-container">
          <ClipLoader color="#123abc" loading={loading} size={150} />
        </div>
      ) : (
        <>
          <div className="pallet-return-form__group">
            <select id="region" className="custom-select" value={selectedRegion} onChange={handleRegionChange}>
              <option value="">Выберите регион</option>
              {uniqueRegions.map((region, index) => (
                <option key={index} value={region}>
                  {region}
                </option>
              ))}
            </select>
            <select id="trading-network" className="custom-select" value={selectedTradingNetwork} onChange={handleTradingChange}>
              <option value="">Выберите торговую сеть</option>
              {uniqueTradingNetworks.map((network, index) => (
                <option key={index} value={network}>
                  {network}
                </option>
              ))}
            </select>
            <select id="return-point" className="custom-select" value={selectedReturnPoint} onChange={handleReturnPointChange}>
              <option value="">Выберите точку возврата</option>
              {uniqueReturnPoints.map((point, index) => (
                <option key={index} value={point}>
                  {point}
                </option>
              ))}
            </select>
          </div>

          <div className="pallet-return-form__group">
            <select id="pln" className="custom-select custom-select--mod" disabled>
              {uniquePlnList.map((pln, index) => (
                <option key={index} value={pln}>{pln}</option>
              ))}
            </select>

            <select id="rcs" className="custom-select custom-select--mod" disabled>
              {uniqueRcsList.map((rcs, index) => (
                <option key={index} value={rcs}>{rcs}</option>
              ))}
            </select>

            <select id="tarif" className="custom-select custom-select--mod" disabled>
              {uniqueTarifList.map((tarif, index) => (
                <option key={index} value={tarif}>{tarif}</option>
              ))}
            </select>
          </div>
        </>
      )}
    </div>
  );
}

export default PopulateForm;
