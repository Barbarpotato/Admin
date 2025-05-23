// Core Modules
import ReactDOM from "react-dom/client";
import React, { Fragment, Suspense } from "react";
import { Box, ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Route, Routes, HashRouter, Navigate } from "react-router-dom";

// Custom Hooks
import useSession from "./hooks/useSession";

// Auth Modules
import Login from "./auth/Login";
import Guard from "./auth/Guard";

// Custom Components
import Sidebar from "./components/SideBar";
import TopBar from "./components/TopBar";

// Context
import { GlobalContextProvider } from "./contexts/GlobalContext";

// Full Pages
import CustomImage from "./pages/Image";

// Exposes Page
import Deployments from "./exposes/Dashboard/Deployments";
import AddBlog from './exposes/Blog/Add';
import BlogOverview from './exposes/Blog/Overview';
import AddProject from './exposes/Projects/Add';
import ProjectOverview from './exposes/Projects/Overview';
import AddBadge from './exposes/Badge/Add';
import BadgeOverview from './exposes/Badge/Overview';
import Notification from './exposes/Notification';

// CSS
import "./index.css";


const queryClient = new QueryClient();

const Base = ({ useStyle = true, children }) => {
  return (
    <Fragment>
      <Sidebar />
      <TopBar />
      <Suspense >
        <Box boxShadow={useStyle ? 'dark-lg' : ''}
          rounded={useStyle ? 'md' : ''}
          p={useStyle ? { base: 3, md: 10 } : ''}
          m={useStyle ? { base: 3, md: 10 } : ''}>
          {children}
        </Box>
      </Suspense>
    </Fragment>
  );
};

const App = () => {

  const [token, _setToken] = useSession("token", null);

  return (
    <HashRouter basename={process.env.NODE_ENV === 'production' ? '/Site/' : '/'}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <GlobalContextProvider>
            <Routes>

              <Route path="/Login" element={<Login />} />

              {/* Protected Routes */}
              <Route element={<Guard />}>
                <Route path="/" element={<Base><Deployments token={token} /></Base>} />
                <Route path="/ProjectOverview" element={<Base><ProjectOverview token={token} /></Base>} />
                <Route path="/ImageProject" element={<Base><CustomImage token={token} sourceFolder={"project-content"} /></Base>} />
                <Route path="/AddProject" element={<Base><AddProject token={token} /></Base>} />
                <Route path="/Blog" element={<Base><BlogOverview token={token} /></Base>} />
                <Route path="/ImageBlog" element={<Base><CustomImage token={token} sourceFolder={"blog-content"} /></Base>} />
                <Route path="/AddBlog" element={<Base><AddBlog token={token} /></Base>} />
                <Route path="/Badge" element={<Base><BadgeOverview token={token} /></Base>} />
                <Route path="/AddBadge" element={<Base><AddBadge token={token} /></Base>} />
                <Route path="/Notifications" element={<Base><Notification token={token} /></Base>} />
              </Route>

              {/* Redirect all unknown routes to /Login */}
              <Route path="*" element={<Navigate to="/Login" />} />

            </Routes>
          </GlobalContextProvider>
        </ChakraProvider>
      </QueryClientProvider>
    </HashRouter >
  )
};

const rootElement = document.getElementById("app");
if (!rootElement) throw new Error("Failed to find the root element");

const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
