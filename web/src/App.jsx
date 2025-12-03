
import './App.css'
import Button from './components/common/button/Button';
import AdminTabBar from './components/common/adminTabBar/AdminTabBar';
import ApexChart from './components/common/chart/ApexChart'
import Complaintchartcard from './components/common/complaintchartcard/complaintchartcard';
import AdminHeader from './components/layout/adminHeader/AdminHeader'
import { BrowserRouter as Router } from 'react-router-dom';



const statusData = [
  { label: 'Pending', count: 234, color: '#76AE54' },
  { label: 'In Progress', count: 456, color: '#FFA500' },
  { label: 'Resolved', count: 543, color: '#76AE54' },
  { label: 'Closed', count: 98, color: '#0000FF' },
  { label: 'Rejected', count: 14, color: '#FF0000' },
];

const priorityData = [
  { label: 'Low', count: 543, color: '#76AE54' },
  { label: 'Medium', count: 987, color: '#FFA500' },
  { label: 'High', count: 161, color: '#FF0000' },
  { label: 'Urgent', count: 64, color: '#FF4500' },
];
function App() {

  return (
    <>
      <Router>

        <AdminHeader />

        <AdminTabBar />
        <div>
          <Button title="Add Item" icon="plus" onClick={() => console.log('Add clicked')} />
          <Button title="Loading..." icon="loader" backgroundColor="#FF5733" />
          <Button title="Report" icon="flag" onClick={() => alert('Reported!')} />
          <Button title="Export" icon='FileBarChartIcon'/> 
        </div>
        <div className="dashboard">
          <Complaintchartcard title="Complaints by Status" data={statusData} />
          <Complaintchartcard title="Complaints by Priority" data={priorityData} />
        </div>
        <ApexChart />
      </Router>

    </>
  )
}

export default App


// TODO: AdminLayout , EmployeeLayout , EmployeeHeader ,footer , pages & AppRoutes , AdminLogin , EmployeeLogin
// FIXME: App.jsx ,App.css (after init pages and AppRoutes) ,  shadow (filter or boxShadow) for all components 