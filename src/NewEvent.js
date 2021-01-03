import { Component } from 'react';
import firebase from './firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import ScrollToTopOnMount from './ScrollToTopOnMount';


class NewEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // keep track of the variables on the new event form
            newEventName: '',
            newEventPartySize: '',
            newEventType: '',
            newEventDate: '',
            newEventTime: '',
        }
    }

    handleChangeNewEvent = (event) => {
        // store event.target.value in a constant
        const value = event.target.value;
        this.setState({
            // target each propery by the input's id and set it to the value stored in the constant
            [event.target.id]: value
        });
    }

    // Update values/add to Firebase on form submit
    handleSubmit = (event) => {
        event.preventDefault();
        const dbRef = firebase.database().ref();
        const newEntryObj = {
            name: this.state.newEventName,
            partySize: this.state.newEventPartySize,
            type: this.state.newEventType,
            date: this.state.newEventDate,
            time: this.state.newEventTime
        };
        dbRef.push(newEntryObj);
        this.setState({
            newEventName: '',
            newEventPartySize: '',
            newEventType: '',
            newEventDate: '',
            newEventTime: ''
        });

        // Call Parent function to hide the form
        this.props.hideForm();
    }

    closeForm = () =>{
        window.location.reload();
    }

    // Show each event
    render() {
        return (
            <div className="newFormBackground">
                <ScrollToTopOnMount />
                <div className="newFormHeaddingForm wrapper">
                    <div className="close"><button onClick={this.closeForm} aria-label="Close window"><FontAwesomeIcon icon={faTimesCircle} /></button></div>
                    <h2 aria-live="polite" className="headdingNewForm">Add Your Own Event!</h2>
                    <form className="newEventForm" onSubmit={this.handleSubmit} aria-live="polite">
                        {/* // On change run the function to update the state */}
                        <fieldset>
                            <label htmlFor="newEventName" className="srOnly">Party description </label>
                            <input type="text" className="inputFormUser newEventName" id="newEventName" name="inputForm" value={this.state.newEventName} placeholder="Party Description" required onChange={this.handleChangeNewEvent} />
                            <label htmlFor="newEventPartySize" className="srOnly">Party Size </label>
                            <input type="number" className="inputFormUser" id="newEventPartySize" name="inputForm" value={this.state.newEventPartySize} placeholder="Party Size" required onChange={this.handleChangeNewEvent} />
                            <label htmlFor="newEventType" className="srOnly">Type </label>
                            <input type="text" className="inputFormUser" id="newEventType" name="inputForm" value={this.state.newEventType}
                                placeholder="Type" required onChange={this.handleChangeNewEvent} />
                            <div className="dateTimeEnter">
                                <label htmlFor="newEventDate">Date:</label>
                                <input type="date" className="inputFormUser" id="newEventDate" name="inputForm" value={this.state.newEventDate} required onChange={this.handleChangeNewEvent} />
                                <label htmlFor="newEventTime" className="timeLabel">Time:</label>
                                <input type="time" className="inputFormUser" id="newEventTime" name="inputForm" value={this.state.newEventTime} required onChange={this.handleChangeNewEvent} />
                            </div>
                            <button type="submit">Create New Event</button>
                        </fieldset>
                    </form>
                </div>
            </div>
        )
    }
}

export default NewEvent;