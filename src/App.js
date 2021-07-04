// Global Imports

import React from 'react';

// Css Imports

import './App.css';

// Component Imports

import ShellHeader from './components/ShellHeader';
import ShellGallery from './components/ShellGallery';
import ShellProduct from './components/ShellProduct';
import ShellCheckout from './components/ShellCheckout';
import ShellFooter from './components/ShellFooter';

class App extends React.Component {

	constructor(props:any) {
		super(props);

		this.state = {
			page : 'checkout'
		}

	}

	setPage = (page: PageEnum) => {

		console.log('Setting the page!!!');
		console.log(page);
		this.setState({
			page : page
		})

	}

	render (): JSX.Element {

		let page: JSX.Element = <ShellGallery/>;

		console.log(this.state.page);

		switch(this.state.page) {
		case 'gallery':
			console.log('setting gallery')
			page = <ShellGallery/>
			break;
		case 'product':
			console.log('setting product')
			page = <ShellProduct/>
			break;
		case 'checkout':
			console.log('setting checkout')
			page = <ShellCheckout/>
			break;
		}

		return (
			<main>
				<ShellHeader/>
				{ page }
				<ShellFooter />
			</main>
		);

	}

}

export default App;
