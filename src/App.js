import React, { Component } from 'react';
import van from './assets/img/van.svg';
import gif from './assets/img/corgi.gif';
import './App.css';
import Modal from './Components/Modal';
import Fade from 'react-reveal/Fade';

export default class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            isOpen: false,
            selectedDay: null
        }
    }
    
    callbackFunction = (childData) => {
        this.setState({selectedDay: childData});
        this.setState({isOpen : false});
    }
    
    render(){

      const myDay = this.state.selectedDay;
        
      return (
        <div className="App">
            <div className="delivery-container">
                <div>
                    <h1>Choose your delivery day</h1>
                    <p> {this.state.message} </p>
                    <p className="medium bg_light-grey">Delivery is always free</p>
                </div>
                <div className="flex-container">
                    <div className="helper_margin">
                        <p className="regular">Thurs March 14</p>
                        <p className="small bg_light-blue"><span><img src={van} alt="van"/></span>Earliest delivery</p>
                    </div>
                    <div className="clip-container">
                        <p className="extra-small">
                            { this.state.selectedDay ? (
                                <span>{myDay}</span>
                            ) : <span>14</span>
                            }
                        </p>
                        <button className="modal_trigger" onClick={(e) => this.setState({ isOpen: true })}>Change</button>
                    </div>
                </div>
                { this.state.selectedDay ? (
                   <img className="gif-img" src={gif} alt="dog excited"/>
                ): null
                }
            </div>
            <Fade top when={this.state.isOpen}>
                <Modal
                    isOpen={this.state.isOpen}
                    onClose={(e) => this.setState({isOpen : false})}
                    parentCallback = {this.callbackFunction}
                />
            </Fade>
        </div>
      );  
    }
}