import { createRoot } from 'react-dom/client';
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './Pages/LoginPage/LoginPage';
import Sidebar from './components/Sidebar/Sidebar';
import AddProductForm from './components/AddProduct/AddProduct';
import CreateCustomer from './components/CreateCustomer/CreateCustomer';
import AddUserForm from './components/AddUser/AddUser';
import ProductsPage from './Pages/ProductsPage/ProductsPage';
import CustomersTable from './components/CustomersTable/CustomersTable';
import CreateOrder from './components/CreateOrder/CreateOrder';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

root.render(
  <Router>
    <Routes>
      <Route path="/" element={<LoginPage/>}/>
      <Route path='/main' element={<Sidebar/>}>
          <Route path='products' element={<ProductsPage/>}/>
          <Route path='addproduct' element={<AddProductForm/>}/>
          {/* <Route path='customers' element={<CustomersTable/>}/> */}
          <Route path='addcustomer' element={<CreateCustomer/>}/>
          <Route path='adduser' element={<AddUserForm/>}/> 
          <Route path='createorder' element={<CreateOrder/>}/>
          <Route path='customers' element={<CustomersTable/>}/>
      </Route>
    </Routes>
  </Router>
);
