import React, { Component } from 'react' 
// import { CircularProgress } from '@material-ui/core';
import { GoSync } from 'react-icons/go';
import { TiTick } from 'react-icons/ti';
import { SiMediafire } from 'react-icons/si';

import './SwipeButton.css'

const slider = React.createRef();
const container = React.createRef();
const isTouchDevice = 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0;
const vibration = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

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
		vibration && vibration(1000);
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
				<div className={'tw-flex tw-items-center tw-justify-start rsbContainer ' + (this.state.unlocked ? 'rsbContainerUnlocked' : '')} ref={container}>
					<div className='rsbcSlider tw-flex tw-items-center tw-justify-center' 
						ref={slider} 
						onMouseDown={this.startDrag} 
						style={{ background: this.props.disabled ? "grey" : this.props.color }}
						onTouchStart={this.startDrag}
					>
						<SiMediafire className="tw-text-[#fffc00] tw-h-full tw-w-6" />
					</div>
					{this.props.loading ? <GoSync className="tw-w-14 tw-animate-spin-slow tw-h-14" /> : 
						(this.state.unlocked ? <TiTick className="tw-w-14 tw-h-14 tw-text-[#6c5be1]" /> : 
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
