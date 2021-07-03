// Global Imports

import React from 'react';

// Css Imports

import './App.css';

// Component Imports

import ShellHeader from './components/ShellHeader';
import ShellGallery from './components/ShellGallery';
import ShellProduct from './components/ShellProduct';
import ShellFooter from './components/ShellFooter';

// Define Application

type PageEnum = 'gallery' | 'product' | 'checkout';

class App extends React.Component {

	constructor(props: any) {
		super(props);

		console.log(typeof props);

		this.state = {
			page : 'gallery'
		}
	}

	setPage = (page: PageEnum) => {

		console.log('Setting the page!!!');

	}

	render (): JSX.Element {

		return (
			<main>
				<ShellHeader/>
				<ShellGallery/>
				<ShellProduct/>
				<ShellFooter />
			</main>
		);

	}

}

export default App;
