import React from 'react'

const MyCarousel = () => {

	return (
		<div id="carouselExampleSlidesOnly" className="carousel slide" data-bs-ride="carousel">
			<div className="carousel-inner">
				<div className="carousel-item active">
					<img src="https://kenney.nl/content/3-assets/12-blaster-kit/preview-kenney.png"/>
				</div>
			</div>
		</div>
	);

}

const MyDescription = () => {

	return (
		<div className="col-md-8">
			<h3 className="pb-4 mb-4 border-bottom">
				Dashie the Cyber-Bunny
			</h3>

			<article className="blog-post">
				<p className="blog-post-meta">June 21, 2021</p>

				<p>Dashie the Cyber Bunny is a playful little bunny girl, young and eager to learn. Being a bunny reflects the library's small and nimble nature. Her low-polygon costume reflects the library's purpose of managing matrices and vectors. </p>

				<p>Mascot character designed by Tyson Tan. Tyson Tan offers mascot design service for free and open source software, free of charge, under free license. <a href='https://www.tysontan.com/'>https://www.tysontan.com/</a></p>

				<p>3D Model by: Vic Wang Homepage : <a href='https://vidavic.artstation.com'>https://vidavic.artstation.com</a></p>

				<hr></hr>

				<h2>Model Information</h2>
				<ul>
					<li>Triangles 1.6k</li>
					<li>Quads 1.6k</li>
					<li>Total Triangles 4.7k</li>
					<li>Vertices 2.5k</li>
					<li>Rigged</li>
					<li>No Animations</li>
					<li>FBX Format</li>
				</ul>

				<h2>License</h2>

				<p>CC0 1.0 Universal</p>

				<p>You're free to use this asset in any project, personal or commercial. There's no need to ask permission before using these. Giving attribution is not required, but is greatly appreciated!</p>

			</article>
		</div>
	);

}


const MyCart = () => {

	return (
		<div className="col-md-4">
			<div className="position-sticky" style={{ top: '6rem' }}>
				<div className="p-3 mb-3 rounded purchase">
					<h4 className='price'>500.00 $trtl</h4>
					<button type="button" className="btn btn-primary" id="checkout">Add to Cart</button>
				</div>

				<div className="p-3">
					<h4>Stats</h4>
					<ol className="list-unstyled mb-0">
						<li>
							<table>
								<tbody>
								<tr>
									<td className='icon'>
										<span className="material-icons md-18">visibility</span>
									</td>
									<td className='label'>Views</td>
									<td className='num'>
										<a>146</a>
									</td>
								</tr>
								</tbody>
							</table>
						</li>
						<li>
							<table>
								<tbody>
								<tr>
									<td className='icon'>
										<span className="material-icons md-18">download</span>
									</td>
									<td className='label'>Downloads</td>
									<td className='num'>
										<a id='downloads'>7</a>
									</td>
								</tr>
								</tbody>
							</table>
						</li>

					</ol>
				</div>

			</div>
		</div>
	)

}



class ShellProduct extends React.Component {

	constructor(props: any) {
		super(props);
		this.state = {}
	}

	render () {

		return (
			<section className="container" style={{ display : 'none' }}>
				<MyCarousel />
				<div className="row g-5">
					<MyDescription />
					<MyCart />
				</div>
			</section>
		)

	}

}

export default ShellProduct;
