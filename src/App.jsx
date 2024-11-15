import React, { Fragment, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";

import "./index.css";
import { Box, ChakraProvider } from "@chakra-ui/react";
import { Route, Routes, BrowserRouter } from "react-router-dom";

import Home from "./Home";
import Login from "./auth/Login";
import Guard from "./auth/Guard";

import Sidebar from "./components/SideBar";
import TopBar from "./components/TopBar";
import Loading from "./utils/Loading";

// Lazy load the Remote component
const Introduction = React.lazy(() => import("CMS_Registry/Introduction"));
const Projects = React.lazy(() => import("CMS_Registry/Projects"));
const BlogOverview = React.lazy(() => import("CMS_Registry/BlogOverview"));
const AddBlog = React.lazy(() => import("CMS_Registry/AddBlog"));

const queryClient = new QueryClient();

const Base = ({ children }) => {
  return (
    <Fragment>
      <Sidebar />
      <TopBar />
      <Suspense fallback={<Loading />}>
        <Box boxShadow='dark-lg' p='6' rounded='md' p={{ base: 3, md: 10 }} m={{ base: 3, md: 10 }}>
          {children}
        </Box>
      </Suspense>
    </Fragment>
  );
};

const App = () => (

  <BrowserRouter basename={process.env.NODE_ENV === 'production' ? '/Admin/' : '/'}>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <Routes>
          <Route path="/Login" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<Guard />}>
            <Route path="/" element={<Base><Home /></Base>} />
            <Route path="/Introduction" element={<Base><Introduction /></Base>} />
            <Route path="/Projects" element={<Base><Projects /></Base>} />
            <Route path="/Blog" element={<Base><BlogOverview token={localStorage.getItem('token')} /></Base>} />
            <Route path="/AddBlog" element={<Base><AddBlog token={localStorage.getItem('token')} /></Base>} />
          </Route>
        </Routes>
      </ChakraProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

const rootElement = document.getElementById("app");
if (!rootElement) throw new Error("Failed to find the root element");

const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
