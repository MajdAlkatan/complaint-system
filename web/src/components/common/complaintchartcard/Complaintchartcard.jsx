import React from 'react';
import './Complaintchartcard.css';

const Complaintchartcard = ({ title, data }) => {
  return (
    <div className="complaints-card">
      <h2>{title}</h2>
      {data.map(({ label, count, color }) => (
        <div key={label} className="complaint-item">
          <div className="label">{label}</div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(count / 1000) * 100}%`, backgroundColor: color }}
            ></div>
          </div>
          <div className="count">{count}</div>
        </div>
      ))}
    </div>
  );
};

export default Complaintchartcard;