import { createRoot } from 'react-dom/client';
import { Provider } from "react-redux";
import store from "./store";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import CustomersTable from './components/CustomersTable/CustomersTable';
import LoginPage from './Pages/LoginPage/LoginPage';
import Sidebar from './components/Sidebar/Sidebar';
import AddProductForm from './components/AddProduct/AddProduct';
import CreateCustomer from './components/CreateCustomer/CreateCustomer';
import AddUserForm from './components/AddUser/AddUser';
import ProductsPage from './Pages/ProductsPage/ProductsPage';
import CustomerProfile from './components/CustomerProfil/CustomerProfil';
import CreateOrder from './components/CreateOrder/CreateOrder';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

root.render(
  <Provider store={store}>
  <Router>
    <Routes>
      <Route path="/" element={<LoginPage/>}/>
      <Route path='/main' element={<Sidebar/>}>
          <Route path='products' element={<ProductsPage/>}/>
          <Route path='addproduct' element={<AddProductForm/>}/>
          <Route path='customers' element={<CustomersTable/>}/>
          <Route path='addcustomer' element={<CreateCustomer/>}/>
          <Route path='customer/:id' element={<CustomerProfile/>}/>
          <Route path='createorder' element={<CreateOrder/>}/>
          <Route path='adduser' element={<AddUserForm/>}/>
          
      </Route>
    </Routes>
  </Router>
  </Provider>
);
