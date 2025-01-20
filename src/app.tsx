import { createRoot } from 'react-dom/client';
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import CustomersTable from './components/CustomersTable/CustomersTable';
import CustomerProfile from './components/CustomerProfil/CustomerProfil';
import CreateOrder from './components/CreateOrder/CreateOrder';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

root.render(
  <Router>
    <Routes>
      
      <Route path="/" element={<CustomersTable/>}/>
      <Route path='/customer/:customerId' element={<CustomerProfile/>}/>
    </Routes>
  </Router>
);
