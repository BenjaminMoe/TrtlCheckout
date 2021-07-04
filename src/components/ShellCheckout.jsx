import React from 'react'

const ShipTo = () => {

	return (
		<div>
			<h4 className="mb-3">Ship To</h4>
				<form className="needs-validation" noValidate={true}>
					<div className="row g-3">

						<div className="col-12">
							<label htmlFor="email" className="form-label">Email <span className="text-muted">(Required)</span></label>
							<input type="email" className="form-control" id="email" placeholder="you@example.com"/>
							<div className="invalid-feedback">
								Please enter a valid email address for shipping updates.
							</div>
						</div>

						<div className="col-sm-6">
							<label htmlFor="firstName" className="form-label">First name</label>
							<input type="text" className="form-control" id="firstName" />
							<div className="invalid-feedback">
								Valid first name is required.
							</div>
						</div>

						<div className="col-sm-6">
							<label htmlFor="lastName" className="form-label">Last name</label>
							<input type="text" className="form-control" id="lastName" />
							<div className="invalid-feedback">
								Valid last name is required.
							</div>
						</div>

						<div className="col-12">
							<label htmlFor="address" className="form-label">Address</label>
							<input type="text" className="form-control" id="address" />
							<div className="invalid-feedback">
								Please enter your shipping address.
							</div>
						</div>

						<div className="col-12">
							<label htmlFor="address2" className="form-label">Address 2 <span className="text-muted">(Optional)</span></label>
							<input type="text" className="form-control" id="address2" />
						</div>

						<div className="col-md-5">
							<label htmlFor="country" className="form-label">Country</label>
							<select className="form-select" id="country">
								<option value="">Choose...</option>
								<option>United States</option>
							</select>
							<div className="invalid-feedback">
								Please select a valid country.
							</div>
						</div>

						<div className="col-md-4">
							<label htmlFor="state" className="form-label">State</label>
							<select className="form-select" id="state">
								<option value="">Choose...</option>
								<option>California</option>
							</select>
							<div className="invalid-feedback">
								Please provide a valid state.
							</div>
						</div>

						<div className="col-md-3">
							<label htmlFor="zip" className="form-label">Zip</label>
							<input type="text" className="form-control" id="zip"/>
							<div className="invalid-feedback">
								Zip code required.
							</div>
						</div>
					</div>
				</form>
			</div>
		)

}

const CheckoutText = () => {

	return (
		<div className="py-5 text-center">
			<h2>ShellShop Checkout</h2>
			<p className="lead">
				Put in your email address, and then scan the QR Code
				to complete your checkout.
			</p>
		</div>

	)

}

const TurtleCheckout = () => {

	return (
		<form>
			<hr className="my-4"></hr>
			<button className="w-100 btn btn-primary btn-lg" type="submit">
				Request Payment Code
			</button>
			<h4 className="mb-3">Checkout with TurtlePay</h4>
			<div className="my-3">
				SHow QR Code and Stuff goes here
			</div>
		</form>
	)
}

const TurtleCart = () => {

	return (
		<div className="col-md-5 col-lg-4 order-md-last">
			<h4 className="d-flex justify-content-between align-items-center mb-3">
				<span className="text-primary">Your cart</span>
				<span className="badge bg-primary rounded-pill">3</span>
			</h4>
			<ul className="list-group mb-3">
				<li className="list-group-item d-flex justify-content-between lh-sm">
					<div>
						<h6 className="my-0">Product name</h6>
						<small className="text-muted">Brief description</small>
					</div>
					<span className="text-muted">$12</span>
				</li>
				<li className="list-group-item d-flex justify-content-between lh-sm">
					<div>
						<h6 className="my-0">Second product</h6>
						<small className="text-muted">Brief description</small>
					</div>
					<span className="text-muted">$8</span>
				</li>
				<li className="list-group-item d-flex justify-content-between lh-sm">
					<div>
						<h6 className="my-0">Third item</h6>
						<small className="text-muted">Brief description</small>
					</div>
					<span className="text-muted">$5</span>
				</li>
				<li className="list-group-item d-flex justify-content-between">
					<span>Total (USD)</span>
					<strong>$20</strong>
				</li>
			</ul>
		</div>
	)

}

class ShellCheckout extends React.Component {

	constructor(props) {
		super(props)

		this.state = {}
	}

	render () {

		console.log('Render the checkout!!!')

		return (
			<section className="container">
				<CheckoutText/>
				<div className="row g-5">
					<TurtleCart/>
					<div className="col-md-7 col-lg-8">
						<ShipTo/>
						<TurtleCheckout/>
					</div>
				</div>
			</section>
		)

	}

}

export default  ShellCheckout;
