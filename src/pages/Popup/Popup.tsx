import React, { useEffect, useState } from 'react';
import './Popup.css';

const Popup: React.FC = () => {
  const [realTimeExchangeRateHTML, setRealTimeExchangeRateHTML] = useState<string>('');

  const fetchData = async () => {
    try {
      const response = await fetch('https://srh.bankofchina.com/search/whpj/search_cn.jsp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'erectDate=&nothing=&pjname=%E7%BE%8E%E5%85%83&head=head_620.js&bottom=bottom_591.js',
      });

      const data = await response.text();
      const doc = new DOMParser().parseFromString(data, 'text/html');
      const tbody = doc.querySelector('body > div.wrapper > div.BOC_main.publish > table > tbody');

      if (!tbody || tbody.children.length < 2) return;

      const range = document.createRange();
      range.setStartBefore(tbody.children[0]);
      range.setEndAfter(tbody.children[1]);

      const fragment = range.cloneContents();
      const serializer = new XMLSerializer();
      const htmlString = serializer.serializeToString(fragment);

      setRealTimeExchangeRateHTML(htmlString);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="App">
      <button onClick={fetchData}>查询汇率</button>
      <table dangerouslySetInnerHTML={{ __html: realTimeExchangeRateHTML }} />
    </div>
  );
};

export default Popup;
