import React, { Component } from 'react' 
// import { CircularProgress } from '@material-ui/core';
import { GoSync } from 'react-icons/go';
import { FaAngleRight } from 'react-icons/fa';

import './SwipeButton.css'
import { BsCheck2 } from 'react-icons/bs';

const slider = React.createRef();
const container = React.createRef();
const isTouchDevice = 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0;

class SwipeButton extends Component {
	state = {};

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

	updateSliderStyle = () => {
		if(this.props.disabled || this.unmounted || this.state.unlocked) return;
		
		slider.current.style.left = (this.sliderLeft + 0)+'px';
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
		this.setState({
			unlocked: true
		});

		navigator.vibrate(1000);
	}

	getText = () => {
		return window.innerWidth < 530 ? 'EXECUTE' : this.props.text || 'EXECUTE';
	}

	componentWillUnmount() {
		this.unmounted = true;
	}

	render() {
		return (
			<div className='tw-mb-2 ReactSwipeButton'>
				<div style={{ background: `${(this.props.loading || this.state.unlocked) ? "#b4b4b4" : "linear-gradient(5deg, black, #7D7D7F)"}`}} className={`tw-flex tw-items-center tw-justify-start rsbContainer ${(this.state.unlocked ? 'rsbContainerUnlocked' : '')}`} ref={container}>
					<div className='rsbcSlider tw-flex tw-items-center tw-justify-center' 
						ref={slider} 
						onMouseDown={this.startDrag} 
						style={{ background: this.props.disabled ? "#D0D0D1" : "white" }}
						onTouchStart={this.startDrag}
					>
						<FaAngleRight className="tw-text-black-app tw-h-full tw-w-3" />
					</div>
					{this.props.loading ? <GoSync className="tw-w-8 tw-animate-spin-slow tw-h-14 tw-text-black-app" /> : 
						(this.state.unlocked ? <BsCheck2 className="tw-w-14 tw-h-14 tw-text-black-app" /> : 
							<div className={`rsbcText ${window.innerWidth < 530 ? 'tw-ml-7' : ''}`}>
								<div className="rsbcanimation tw-font-noto">
									{this.getText()}
								</div>
							</div>
						)
					}
				</div>
			</div>
		);
	}
}

export default SwipeButton;
