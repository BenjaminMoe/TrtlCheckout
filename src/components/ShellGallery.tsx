import React from 'react'

const MySummary: JSX.Element = () => {

	return (
		<div className="py-5 text-center container turtle-bg">
			<div className="row py-lg-5">
				<div className="shop-text col-lg-6 col-md-8 mx-auto">
					<h1 className="">Example Store Front</h1>
					<p className="lead">
						This is a basic store front using the assets from
						<a href='https://kenney.nl'>https://kenney.nl</a>
						for a proof of concept. You can swap these out
						to set up your store.
					</p>
					<p>
						<a href="#" className="btn btn-primary my-2">Make an Account</a>
						<a href="#" className="btn btn-secondary my-2">Fork on Github</a>
					</p>
				</div>
			</div>
		</div>
	)

}

const MyCard: JSX.Element = (props: Props) => {

	return (
		<div className="col">
			<div className="card shadow-sm">

				<img src='https://kenney.nl/thumbs/assets/city-kit-suburban/preview-kenney-350x196.png'/>

				<div className="card-body">

					<h5>Asset Name</h5>

					<p className="card-text">
						Asset Description
					</p>

					<div className="d-flex justify-content-between align-items-center">
						<div className="btn-group">
							<button type="button" className="btn btn-sm btn-outline-secondary">Add to Cart</button>
						</div>
						<small className="text-muted">1,000 TRTL</small>
					</div>
				</div>
			</div>
		</div>
	);

}

const MyPagination: JSX.Element = (props: Props) => {

    return (
		<nav className='my-pagination' aria-label="Page navigation example">
			<ul className="pagination pagination-lg justify-content-center">
				<li className="page-item disabled">
					<a className="page-link" href="#" tabIndex="-1" aria-disabled="true">Previous</a>
				</li>
				<li className="page-item active">
					<a className="page-link" href="#">1</a>
				</li>
				<li className="page-item">
					<a className="page-link" href="#">2</a>
				</li>
				<li className="page-item">
					<a className="page-link" href="#">3</a>
				</li>
				<li className="page-item">
					<a className="page-link" href="#">Next</a>
				</li>
			</ul>
		</nav>
    );

}



class ShellGallery extends React.Component {

	constructor(props) {

		super(props);

		this.state = {

		}

	}

	render: JSX.Element = () => {

		return (
			<section style={{ display : 'none' }}>
				<MySummary/>
				<div className="album py-5">
					<div className="container">
						<div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
							<MyCard/>
							<MyCard/>
							<MyCard/>
							<MyCard/>
							<MyCard/>
							<MyCard/>
							<MyCard/>
							<MyCard/>
						</div>
						<MyPagination/>
					</div>
				</div>
			</section>
		);

	}

}

export default ShellGallery;
