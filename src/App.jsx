// Core Modules
import React, { Fragment, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { Box, ChakraProvider } from "@chakra-ui/react";
import { Route, Routes, HashRouter, Navigate } from "react-router-dom";

// Custom Hooks
import useSession from "./hooks/useSession";

// Auth Modules
import Login from "./auth/Login";
import Guard from "./auth/Guard";

// Custom Components
import Sidebar from "./components/SideBar";
import TopBar from "./components/TopBar";

// Exposes Page
import Metrics from "./exposes/Dashboard/Metrics";
import AddBlog from './exposes/Blog/Add';
import BlogOverview from './exposes/Blog/Overview';
import AddProject from './exposes/Projects/Add';
import ProjectOverview from './exposes/Projects/Overview';
import AddBadge from './exposes/Badge/Add';
import BadgeOverview from './exposes/Badge/Overview';

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
          <Routes>

            <Route path="/Login" element={<Login />} />

            {/* Protected Routes */}
            <Route element={<Guard />}>
              <Route path="/" element={<Base>Hello</Base>} />
              <Route path="/MetricsLogs" element={<Base><Metrics token={token} /></Base>} />
              <Route path="/ProjectOverview" element={<Base><ProjectOverview token={token} /></Base>} />
              <Route path="/AddProject" element={<Base><AddProject token={token} /></Base>} />
              <Route path="/Blog" element={<Base><BlogOverview token={token} /></Base>} />
              <Route path="/AddBlog" element={<Base><AddBlog token={token} /></Base>} />
              <Route path="/Badge" element={<Base><BadgeOverview token={token} /></Base>} />
              <Route path="/AddBadge" element={<Base><AddBadge token={token} /></Base>} />
            </Route>

            {/* Redirect all unknown routes to /Login */}
            <Route path="*" element={<Navigate to="/Login" />} />

          </Routes>
        </ChakraProvider>
      </QueryClientProvider>
    </HashRouter >
  )
};

const rootElement = document.getElementById("app");
if (!rootElement) throw new Error("Failed to find the root element");

const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
