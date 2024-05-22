import { useState, useEffect } from 'react';

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

  const [formData, setFormData] = useState({
    regions: [],
    tradingNetworks: [],
    returnPoints: [],
    plnListData: [],
    rcsListData: [],
    tarifListData: [],
  });

  useEffect(() => {
    if (!loading) {
      const regions = [];
      const tradingNetworks = [];
      const returnPoints = [];
      const plnListData = [];
      const rcsListData = [];
      const tarifListData = [];

      data.forEach((row) => {
        regions.push(row[0]);
        tradingNetworks.push(row[1]);
        returnPoints.push(row[2]);
        plnListData.push(row[3]);
        rcsListData.push(row[4]);
        tarifListData.push(row[5]);
      });

      setFormData({
        regions,
        tradingNetworks,
        returnPoints,
        plnListData,
        rcsListData,
        tarifListData,
      });
    }
  }, [data, loading]);

  return { data, loading, formData };
}

export default useFetchData;
