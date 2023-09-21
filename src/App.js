import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react'
import SocketProvider from './providers/Socket';
import { PeerProvider } from './providers/Peer';
import Layout from './components/Layout';
import Home from './pages/Home';
import Room from './pages/Room';


const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			{
				path: "home",
				element: <Home />,
			},
			{
				path: "room/:roomId",
				element: <Room />,
			},
		],
	}
])

const App = () => {
	return (
		<SocketProvider>
			<PeerProvider>
				<ChakraProvider>
					<RouterProvider router={router} />
				</ChakraProvider>
			</PeerProvider>
		</SocketProvider>
	);
}

export default App;
