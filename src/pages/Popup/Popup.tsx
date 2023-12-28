import React, { useEffect, useState } from 'react';
import './Popup.css';

const Popup = () => {
  const [realTimeExchangeRateHTML, setRealTimeExchangeRateHTML] = useState('');

  // 用于爬取数据的函数
  const fetchData = async () => {
    const url = 'https://srh.bankofchina.com/search/whpj/search_cn.jsp';
    const headers = {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Content-Type': 'application/x-www-form-urlencoded',
      'DNT': '1',
      'Origin': 'https://srh.bankofchina.com',
      'Pragma': 'no-cache',
      'Referer': 'https://srh.bankofchina.com/search/whpj/search_cn.jsp',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"'
    };
    const body = 'erectDate=&nothing=&pjname=%E7%BE%8E%E5%85%83&head=head_620.js&bottom=bottom_591.js';

    fetch(url, {
      method: 'POST',
      headers: headers,
      body: body
    })
      .then(response => response.text())
      .then(data => {
        // 处理返回的HTML数据
        // 解析HTML，找到所需的汇率信息
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        const tbody = doc.querySelector('body > div.wrapper > div.BOC_main.publish > table > tbody');

        if (tbody && tbody.children.length >= 2) {
          // setRealTimeExchangeRateHTML(tbody.innerHTML);

          // 创建Range对象
          const range = document.createRange();

          // 设置Range的起始点为tbody的第一个子节点的开始
          range.setStartBefore(tbody.children[0]);

          // 设置Range的结束点为第二个子节点的结束
          range.setEndAfter(tbody.children[1]);

          // 使用Range的内容
          const fragment = range.cloneContents();

          const serializer = new XMLSerializer();
          const htmlString = serializer.serializeToString(fragment);

          setRealTimeExchangeRateHTML(htmlString);
        }
      })
  };

  // 组件初始化时获取数据
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="App">
      <button onClick={fetchData}>查询汇率</button>
      {/* 使用React来渲染数据 */}
      <table dangerouslySetInnerHTML={{ __html: realTimeExchangeRateHTML }} />
    </div>
  );
};

export default Popup;
