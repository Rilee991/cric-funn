import React, { Component } from 'react' 
import { Check, KeyboardArrowRightOutlined, LastPage, NavigateNext } from '@material-ui/icons';
import { CircularProgress } from '@material-ui/core';

import './SwipeButton.css'

const slider = React.createRef();
const container = React.createRef();
const isTouchDevice = 'ontouchstart' in document.documentElement;

export default class SwipeButton extends Component {
	state = {}

	componentDidMount() {
		if(isTouchDevice) {
			document.addEventListener('touchmove', this.onDrag);
			document.addEventListener('touchend', this.stopDrag);
		} else {
			document.addEventListener('mousemove', this.onDrag);
			document.addEventListener('mouseup', this.stopDrag);  
		}

		this.containerWidth = container.current.clientWidth - 50;
	}

	onDrag = e => {
		if(this.props.disabled || this.unmounted || this.state.unlocked) return;
		if(this.isDragging) {
			if(isTouchDevice) {
				this.sliderLeft = Math.min(Math.max(0, e.touches[0].clientX - this.startX), this.containerWidth);
			} else {
				this.sliderLeft = Math.min(Math.max(0, e.clientX - this.startX), this.containerWidth);
			}
			this.updateSliderStyle();
		}
	}

	updateSliderStyle =()=> {
		if(this.props.disabled || this.unmounted || this.state.unlocked) return;
		
		slider.current.style.left = (this.sliderLeft + 50)+'px';
	}

	stopDrag = () => {
		if(this.props.disabled || this.unmounted || this.state.unlocked) return;

		if(this.isDragging) {
			this.isDragging = false;
			if(this.sliderLeft > this.containerWidth * 0.9) {
				this.sliderLeft = this.containerWidth;
				
				if(this.props.onSuccess) {
					this.props.onSuccess();
					this.onSuccess();
				}
			} else {
				this.sliderLeft = 0;
				
				if(this.props.onFailure) {
					this.props.onFailure();
				}
			}
			this.updateSliderStyle();
		}
	}

	startDrag = e => {
		if(this.props.disabled || this.unmounted || this.state.unlocked) return;
		
		this.isDragging = true;
		if(isTouchDevice) {
			this.startX = e.touches[0].clientX;
		} else {
			this.startX = e.clientX;
		}
	}

	onSuccess = () => {
		// container.current.style.width = container.current.clientWidth+'px';
		// container.current.style.background = "red";
		this.setState({
			unlocked: true
		});
	}

	getText = ()=> {
		return this.state.unlocked ? (this.props.textUnlocked || 'UNLOCKED') : (this.props.text || 'SLIDE');
	}

	componentWillUnmount() {
		this.unmounted = true;
	}

	render() { 
		return (
			<div className='ReactSwipeButton'>
				<div className={'rsbContainer ' + (this.state.unlocked ? 'rsbContainerUnlocked' : '')} ref={container}>
					<div className='rsbcSlider tw-flex tw-items-center tw-justify-center' 
						ref={slider} 
						onMouseDown={this.startDrag} 
						style={{ background: this.props.disabled ? "grey" : this.props.color }}
						onTouchStart={this.startDrag}
					>
						<NavigateNext className="tw-text-white tw-h-full tw-w-6" />
					</div>
					<div className='rsbcText'>
						{this.props.loading ? <CircularProgress className="tw-w-14 tw-h-14" /> : this.state.unlocked ? <Check className="tw-w-14 tw-h-14 tw-text-yellow-500" /> : this.getText()}
					</div>
				</div>
			</div>
		);
	}
}