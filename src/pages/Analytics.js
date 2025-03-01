import React, { useState, useEffect } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { getAnalytics, searchAnalytics } from '../utils/api';
import '../styles/analytics.css';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({ views: 0, clicks: 0, devices: {}, links: {}, shops: {}, referrers: {} });
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await getAnalytics();
        const views = data.filter(a => a.type === 'view').length;
        const clicks = data.filter(a => a.type === 'click').length;
        const devices = data.reduce((acc, curr) => {
          acc[curr.device] = (acc[curr.device] || 0) + 1;
          return acc;
        }, {});
        const links = data.filter(a => a.linkId.includes('link')).reduce((acc, curr) => {
          acc[curr.linkId] = (acc[curr.linkId] || 0) + 1;
          return acc;
        }, {});
        const shops = data.filter(a => a.linkId.includes('shop')).reduce((acc, curr) => {
          acc[curr.linkId] = (acc[curr.linkId] || 0) + 1;
          return acc;
        }, {});
        const referrers = data.reduce((acc, curr) => {
          acc[curr.referrer || 'direct'] = (acc[curr.referrer || 'direct'] || 0) + 1;
          return acc;
        }, {});

        setAnalytics({ views, clicks, devices, links, shops, referrers });
      } catch (err) {
        console.error('Failed to load analytics:', err.message);
      }
    };
    fetchAnalytics();
  }, []);

  useEffect(() => {
    const fetchSearchedAnalytics = async () => {
      try {
        const { data } = await searchAnalytics({ q: searchQuery, page, limit: 10 });
        const views = data.data.filter(a => a.type === 'view').length;
        const clicks = data.data.filter(a => a.type === 'click').length;
        const devices = data.data.reduce((acc, curr) => {
          acc[curr.device] = (acc[curr.device] || 0) + 1;
          return acc;
        }, {});
        const links = data.data.filter(a => a.linkId.includes('link')).reduce((acc, curr) => {
          acc[curr.linkId] = (acc[curr.linkId] || 0) + 1;
          return acc;
        }, {});
        const shops = data.data.filter(a => a.linkId.includes('shop')).reduce((acc, curr) => {
          acc[curr.linkId] = (acc[curr.linkId] || 0) + 1;
          return acc;
        }, {});
        const referrers = data.data.reduce((acc, curr) => {
          acc[curr.referrer || 'direct'] = (acc[curr.referrer || 'direct'] || 0) + 1;
          return acc;
        }, {});

        setAnalytics({ views, clicks, devices, links, shops, referrers });
        setPagination(data.pagination);
      } catch (err) {
        console.error('Failed to search analytics:', err.message);
      }
    };
    fetchSearchedAnalytics();
  }, [searchQuery, page]);

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Traffic Over Time',
      data: [100, 200, 300, 400, 500, 600],
      borderColor: '#00C851',
      fill: false
    }]
  };

  const barData = {
    labels: Object.keys(analytics.devices),
    datasets: [{
      label: 'Traffic by Device',
      data: Object.values(analytics.devices),
      backgroundColor: '#00C851',
      borderColor: '#00C851',
      borderWidth: 1
    }]
  };

  const pieData = {
    labels: Object.keys(analytics.links).concat(Object.keys(analytics.shops)),
    datasets: [{
      data: Object.values(analytics.links).concat(Object.values(analytics.shops)),
      backgroundColor: ['#00C851', '#33FF77', '#66FF99', '#99FFCC', '#CCFFEE']
    }]
  };

  return (
    <div className="container">
      <div className="spark-logo"></div>
      <h2>Overview</h2>
      <p>Feb 8th to Feb 15th</p>
      <div className="stats">
        <div className="stat">Clicks on Links: {analytics.clicks}</div>
        <div className="stat">Clicks on Shops: {Object.values(analytics.shops).reduce((a, b) => a + b, 0)}</div>
      </div>
      <div className="charts">
        <div className="chart">
          <h3>Traffic Over Time</h3>
          <Line data={lineData} />
        </div>
        <div className="chart">
          <h3>Traffic by Device</h3>
          <Bar data={barData} />
        </div>
        <div className="chart">
          <h3>Traffic by Links</h3>
          <Pie data={pieData} />
        </div>
      </div>
      <div className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
          placeholder="Search analytics..."
        />
      </div>
      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
        <span>Page {page} of {pagination.totalPages}</span>
        <button onClick={() => setPage(page + 1)} disabled={page === pagination.totalPages}>Next</button>
      </div>
      <div className="nav-tabs">
        <button>Links</button>
        <button>Appearance</button>
        <button>Analytics</button>
        <button>Settings</button>
      </div>
    </div>
  );
};

export default Analytics;