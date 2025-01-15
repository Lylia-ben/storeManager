import { createRoot } from 'react-dom/client';
import Sidebar from './components/Sidebar/Sidebar';


const rootElement = document.getElementById('root'); // Select the #root div
if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);
root.render(
            <>
              <Sidebar/>
            </>
);
