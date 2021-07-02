// Global Imports

import React from 'react';

// Css Imports

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'

// Component Imports

import ShellHeader from './components/ShellHeader';
import ShellGallery from './components/ShellGallery';

// Define Application

class App extends React.Component {

	constructor(props: Props) {
		super(props);
	}

	render ():JSX.Element {

		return (
			<main>
				<ShellHeader/>
				<ShellGallery/>
			</main>
		);

	}

}

export default App;
