import React, { useEffect, useState } from 'react';

const Popup: React.FC = () => {
  const [realTimeExchangeRateHTML, setRealTimeExchangeRateHTML] = useState<string>('');
  const [loading, setLoading] = useState(true);



  const fetchData = async () => {
    try {
      setLoading(true);

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
      setLoading(false);
    } catch (error) {
      setLoading(false)
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="App">
      <div style={{ paddingBottom: 16 }}>
        <button onClick={fetchData} >实时汇率查询</button>
        <span style={{ paddingLeft: 16 }}>{loading ? '查询中...' : '查询已完成'}</span>
      </div>

      <table dangerouslySetInnerHTML={{ __html: realTimeExchangeRateHTML }} />
    </div>
  );
};

export default Popup;
