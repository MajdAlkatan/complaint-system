import  { useState } from 'react';
import "./AdminTabBar.css"
const AdminTabBar = () => {
  const [activeTab, setActiveTab] = useState(0); // Index of the active tab

  const tabs = [
    'Tab 1', 'Tab 2', 'Tab 3', 'Tab 4', 'Tab 5',
    'Tab 6', 'Tab 7', 'Tab 8', 'Tab 9'
  ];

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return (
    <div className='adminBar'>
      {tabs.map((tab, index) => (
        <div
        className='adminTab'
          key={index}
          onClick={() => handleTabClick(index)}
          style={{
            backgroundColor: activeTab === index ? '#76AE54' : '#ffffff',
            color: activeTab === index ? 'white' : 'black',
            border: index < tabs.length  ? '1px solid #ccc' : 'none'
          }}
        >
          {tab}
        </div>
      ))}
    </div>
  );
};

export default AdminTabBar;
