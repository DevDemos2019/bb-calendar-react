import React, {Component} from 'react';
import './Modal.css';
import moment from 'moment';

export default class Modal extends Component {
constructor(props) {
    super(props);
        this.state = {
            dateContext: moment().set('month',7),
            today: moment(),
            showMonthPopup: false,
            showYearPopup: false,
            selectedDay : this.props.selectedDay,
            //this is bad and works only for August
            unavailableDay: [6, 13, 20, 27 , 2, 9, 16, 23, 30, 3, 10, 17, 24, 31]
        };
    }

    weekdays = ["Monday", "Tuesday", "Wednessday", "Thursday", "Friday", "Saturday","Sunday"];

    weekdaysShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]; // Only show first letter with css to avoid duplicate keys (S/S && T/T) - dummy trick

    months = moment.months();

    // Get data from dateContext
    year = () => {
        return this.state.dateContext.format("Y");
    }
    month = () => {
        return this.state.dateContext.format("MMMM");
    }
    daysInMonth = () => {
        return this.state.dateContext.daysInMonth();
    }
    currentDate = () => {
        console.log("currentDate: ", this.state.dateContext.get("date"));
        return this.state.dateContext.get("date");
    }
    currentDay = () => {
        return this.state.dateContext.format("D");
    }

    firstDayOfMonth = () => {
        let dateContext = this.state.dateContext;
        let firstDay = moment(dateContext).startOf('month').format('d'); 
        return firstDay;
    }

    setMonth = (month) => {
        let monthNo = this.months.indexOf(month);
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).set("month", monthNo);
        this.setState({
            dateContext: dateContext
        });
    }

    Month = () => {
        return (
            <span className="label-month">
                {this.month()}&nbsp;
            </span>
        );
    }

    Year = () => {
        return (
            <span className="label-year">
                {this.year()}
            </span>
        );
    }
   
    onDayClick = (e, day) => {
        this.setState({
            selectedDay: day
        }, () => {
            console.log("Selected day: ", this.state.selectedDay, this.month());
        } );
        this.props.onDayClick && this.props.onDayClick(e, day);
    }
    
    // Use callback to send day to parent App
    sendData = () => {
         const day = this.state.selectedDay;
         this.props.parentCallback(day);
    }

    render() {
        // Map the weekdays i.e Mon, Tue etc as <td>
        let weekdays = this.weekdaysShort.map((day) => {
            return (
                <td key={day} className="week-day">{day}</td>
            )
        });
        
        //Blank slots
        let blanks = [];
        // i = 1 because week is forced to start on Monday 
        for (let i = 1; i < this.firstDayOfMonth(); i++) {
            blanks.push(<td key={i * 80} className="emptySlot">
                {""}
                </td>
            );
        }
        // Day slots with respective classes
        let daysInMonth = [];
        for (let d = 1; d <= this.daysInMonth(); d++) {
            let className = (d === this.currentDay() ? "day current-day": "day");
            let selectedClass = (d === this.state.selectedDay ? " selected-day " : "");  
            let unavailableClass = (this.state.unavailableDay.includes(d) ? " unavailable-day " : "")
            daysInMonth.push(
                <td key={d} className={className + selectedClass + unavailableClass} onClick={(e)=>{this.onDayClick(e, d)}} >{d}</td>
            );
        }

        var totalSlots = [...blanks, ...daysInMonth];
        let rows = [];
        let cells = [];
        
        // Handle weekly rows
        totalSlots.forEach((row, i) => {
            if ((i % 7) !== 0) {
                cells.push(row);
            } else {
                let insertRow = cells.slice();
                rows.push(insertRow);
                cells = [];
                cells.push(row);
            }
            if (i === totalSlots.length - 1) {
                let insertRow = cells.slice();
                rows.push(insertRow);
            }
        });

        let trElems = rows.map((d, i) => {
            return (
                <tr key={i*100}>
                    {d}
                </tr>
            );
        });
        
        let modal = (
             <div className="modal_overlay">
                <div className="modal">
                    <div className="calendar-container">
                        <table className="calendar">
                            <thead>
                                <tr className="calendar-header">
                                    <td colSpan="7">
                                        <this.Month />
                                        <this.Year />
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {weekdays}
                                </tr>
                                {trElems}
                            </tbody>
                        </table>
                    </div>
                    <div className="modal_actions">
                        <button className="modal_cancel-btn" onClick={this.props.onClose}>CANCEL, DON'T CHANGE </button>
                        <button className="modal_change-btn"  onClick={this.sendData}>CHANGE DATE</button>
                    </div>
                </div>    
            </div>
        );
        // Conditional render modal if this.props.isOpen = true 
        if (!this.props.isOpen) {
            modal = null;
        }
        return (
           <div> {modal} </div>
        );
    }
}