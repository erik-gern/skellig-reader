import * as React from 'react';
import { Book } from '../books';
import { SanitizedHtmlWrapper } from '../xml';
import { onMenuTrigger } from '../menu';

interface BoundingClientRect {
	x: number;
	y: number;
	width: number;
	height: number;
	top: number;
	right: number;
	bottom: number;
	left: number;
}

interface ElementWithStyles {
	offsetWidth: number;
	offsetHeight: number;
	getBoundingClientRect: () => BoundingClientRect;
	scrollWidth: number;
	scrollHeight: number;
}

interface BookViewerProps {
	book: Book;
}

interface BookViewerState {
	pageHtml: SanitizedHtmlWrapper;
	pageNum: number;
	pageTotal: number;
	pageWidth: number;
}

export default class BookViewer extends React.Component {
	props: BookViewerProps;
	state: BookViewerState = {
		pageHtml: null,
		pageWidth: 400,
		pageNum: 1,
		pageTotal: null,
	};
	pageContainerRef: React.RefObject<HTMLDivElement>;
	pageElRef: React.RefObject<HTMLDivElement>;
	
	constructor(props) {
		super(props);
		this.onPrevPage = this.onPrevPage.bind(this);
		this.onNextPage = this.onNextPage.bind(this);
		this.pageContainerRef = React.createRef();
		this.pageElRef = React.createRef();
		
		onMenuTrigger('previous-page', () => {
			this.setState({pageNum: this.state.pageNum-1});
		});
		onMenuTrigger('next-page', () => {
			this.setState({pageNum: this.state.pageNum+1});			
		});		
		
		this.renderBook();
	}
	
	render () {
		return (
			<div className="book-viewer"
				style={{width: this.state.pageWidth+'px'}}>
				{this.state.pageHtml
					? <React.Fragment>
						<div ref={this.pageContainerRef} 
							className="book-viewer__page-container"
							style={{width: this.state.pageWidth+'px', columnWidth: this.state.pageWidth+'px'}}>
							<div className="book-viewer__page-scroller"
								style={{left: (this.state.pageNum - 1) * this.state.pageWidth * -1}}>
								<div ref={this.pageElRef}
									className="book-viewer__page"
									dangerouslySetInnerHTML={{__html: this.state.pageHtml.toString()}} />
							</div>
						</div>
						<p className="book-viewer__page-stats">
							<a onClick={this.onPrevPage} className="button" title="Previous Page">&lt;&lt;</a>
							{this.state.pageNum} of {this.state.pageTotal !== null ? this.state.pageTotal : '...'}
							<a onClick={this.onNextPage} className="button" title="Next Page">&gt;&gt;</a>
						</p>
					</React.Fragment>
					: <div>Loading...</div>
				}
			</div>
		);
	}
	
	onPrevPage(e) {
		e.preventDefault();
		this.setState({pageNum: this.state.pageNum-1});
	}

	onNextPage(e) {
		e.preventDefault();
		this.setState({pageNum: this.state.pageNum+1});
	}
	
	async renderBook() {
		const pageHtml: SanitizedHtmlWrapper = await this.props.book.renderHtml();
		this.setState({pageHtml});
		window.setTimeout(() => { this.calculatePages(); }, 2000);
	}
	
	async calculatePages() {
		const bookWidth = ((this.pageElRef.current as unknown) as ElementWithStyles).scrollWidth;
		const totalPages = Math.ceil(bookWidth / this.state.pageWidth);
		this.setState({totalPages});
	}
		
}