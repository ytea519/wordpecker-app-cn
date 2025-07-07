import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, Box } from '@chakra-ui/react';
import theme from './theme';
import { Lists } from './pages/Lists';
import { ListDetail } from './pages/ListDetail';
import { Learn } from './pages/Learn';
import { Quiz } from './pages/Quiz';
import { Header } from './components/Header';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Box bg="slate.900" minH="100vh" color="white">
          <Header />
          <Routes>
            <Route path="/" element={<Navigate to="/lists" replace />} />
            <Route path="/lists" element={<Lists />} />
            <Route path="/lists/:id" element={<ListDetail />} />
            <Route path="/learn/:id" element={<Learn />} />
            <Route path="/quiz/:id" element={<Quiz />} />
          </Routes>
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App;
