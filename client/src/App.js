import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routes from "./routes/index.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {routes.map(({ path, element, children }, idx) => (
          <Route key={idx} path={path} element={element}>
            {children?.map((child, i) => (
              <Route key={i} path={child.path} element={child.element} />
            ))}
          </Route>
        ))}
      </Routes>
    </Router>
  );
}

export default App;
