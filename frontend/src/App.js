import './App.css';
import AddProperty from './components/AddProperty';
import Header from './components/Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AllProperty from './components/AllProperty';
import PropertyDetail from './components/PropertyDetail';
import EditProp from './components/EditProp';
import PropertyCounts from './components/PropertyCounts ';
import News from './components/News';
import CreatePackage from "./components/package/CreatePackage";
import PackageManagement from "./components/package/PackageManagement";
import ConnectPackage from "./components/package/ConnectPackage"



function App() {
  return (
    <Router>
      <div>
        <Header />
      
        <Routes>
          
          <Route path = "/update/:id" element = {<EditProp/>}/>
          <Route path="/add" element={<AddProperty />} />
          <Route path="/" element={<AllProperty />} />
          <Route path="/get/:id" element = {<PropertyDetail/>}/>
          <Route path = "/admin/propertycounts" element = {<PropertyCounts/>}/>
          <Route path = "/News" element = {<News/>}/>
          <Route path="/index" element={<CreatePackage />} />
                <Route path="/packages" element={<PackageManagement />} />
                <Route path="/connect-package" element={<ConnectPackage />} /> {/* Added the route for reviews */}
        
          
          
         
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
