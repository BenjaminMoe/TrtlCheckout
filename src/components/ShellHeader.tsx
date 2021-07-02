import React from 'react'

class ShellHeader extends React.Component {
	
	constructor(props) {
		
		super(props)

		this.state = {
			open : false
		}

	}
	
	handleToggleClick: void = evt => {
		
		this.setState({
			open : !this.state.open
		})

	}

	render: ReactNode = (props: Props)=> {

		return (
			<header className="sticky-top border-bottom mb-4 navbar navbar-light bg-light">
				<div className="container">
					<a className="navbar-brand" href="#">
						<span>ShellShop</span>
					</a>

					<ul className="nav nav-pills">
						<a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false" onClick={this.handleToggleClick}>
							My Cart
						</a>
					</ul>
					<ul className={"dropdown-menu " + (this.state.open ? 'show' : '')} aria-labelledby="navbarDropdownMenuLink">
						<li><a className="dropdown-item" href="#">Gallery</a></li>
						<li><a className="dropdown-item" href="#">Product</a></li>
						<li><a className="dropdown-item" href="#">Checkout</a></li>
					</ul>
				</div>
			</header>
		)

	}

}

export default ShellHeader;
