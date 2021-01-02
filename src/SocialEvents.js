import { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase from './firebase';
import NewEvent from './NewEvent.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import ScrollToTopOnMount from './ScrollToTopOnMount';


class SocialEvents extends Component {
    constructor() {
        super();
        this.state = {
            socialEvents: [],
            userInput: '',
            randomEvent: '',
            showHideNewForm: false,
            showDelete: false
        }
    }

    // Get data from Firebase
    componentDidMount() {
        // Variable that holds a reference to our database
        const dbRef = firebase.database().ref();
        dbRef.on('value', (response) => {
            // store the new state we want to introduce to our app
            const newState = [];
            // response from our query to Firebase inside of a variable .val() 
            const data = response.val();
            // data is an object, so we iterate through it using a for in loop to access each book name 
            let index = 0;
            for (let key in data) {
                //Extract the year and day/month separately for styling only
                let eventDate = new Date(data[key].date);
                let eventYear = eventDate.getFullYear();
                const formattedDate = eventDate.toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'short'
                });
                
                // inside the loop, we push each book name to an array we already created inside the .on() function called newState
                //index is used for class names/styling 
                if (index % 2 === 0) {
                    newState.push({ key: key, eventDetails: data[key], year: eventYear, dayMonth: formattedDate, classIndex: "styleGroupTwo", classIndexDate: "dateTwo"  });
                }
                else {
                    newState.push({ key: key, eventDetails: data[key], year: eventYear, dayMonth: formattedDate, classIndex: "styleGroupOne", classIndexDate: "dateOne" });
                }
                index++;
            }
            
            // Random event
            const lengthOfArray = newState.length;
            const randomIndex = Math.floor(Math.random() * lengthOfArray);
            const randomizedEvent = newState[randomIndex].key;
            // then, we call this.setState in order to update our component's state using the local array newState
            this.setState({
                socialEvents: newState,
                randomEvent: randomizedEvent
            });
        });
    }

    // update the state of the component to be equal to input field
    handleChange = (event) => {
        this.setState({
            userInput: event.target.id
        });
    }

    handleClick = (event) => {
        event.preventDefault();
        if (!this.state.showHideNewForm) {
            this.setState({
                showHideNewForm: true
            });
        }
    }

    hideForm = () => {
        this.setState({
            showHideNewForm: false
        });
    }

    // this function takes event key we want to remove
    removeEvent = (eventKey) => {
        // here we create a reference to the database 
        const dbRef = firebase.database().ref();
        // using the Firebase methods .child(). & remove(), we remove the node specific to the event
        dbRef.child(eventKey).remove();
    }

    // Ask if event needs to be removed
    showDeleteMessage = (eachEventKey) => {
        this.setState({
            showDelete: true,
            idClicked: eachEventKey
        })
    }

    // Delete Event not confirmed
    cancelDelete = () => {
        this.setState({
            showDelete: false,
        })
    }


    // Display data
    render() {
        return (
            <div>
                <ScrollToTopOnMount />
                {/* On click show Enter New Event Form */}
                {this.state.showHideNewForm && <NewEvent hideForm={this.hideForm}/>} 
                {/* Event Lists */}
                {!this.state.showHideNewForm &&
                <section className="socialEvents wrapper">
                    <h2>Pick the event you would rather miss 😢, and we will show you what you can watch instead! 😇 <span className="headerBlock">Can't find the event you're looking for? 🤔 Create a new event!</span></h2>
                    <form className="eventCardsForm">
                        {/* Map through the array and display each event on the page */}
                        {this.state.socialEvents.map((eachEvent) => {
                            return (
                                // On change run the function to update the state
                                <fieldset key={eachEvent.key} onChange={this.handleChange}>
                                    {/* Prevent default submit on key enter to avoid pressing submit a new form */}
                                    <input type="radio" className="check" id={eachEvent.key} name="socialEventCards" value={eachEvent.key} required onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                                    <label htmlFor={eachEvent.key} >
                                        <ul className="eachEvent">
                                            <div className={eachEvent.classIndexDate}>
                                                <li className="time">Time: <time dateTime={eachEvent.eventDetails.time}>{eachEvent.eventDetails.time}</time></li>
                                                <li className="dateInfo"><time dateTime={eachEvent.eventDetails.date}>{eachEvent.dayMonth}<span>{eachEvent.year}</span></time></li>
                                            </div>
                                            <div className={eachEvent.classIndex}>
                                                <div className="removeEvent">
                                                    <FontAwesomeIcon title="Delete This Event Button" tabindex="0" onKeyPress={() => this.showDeleteMessage(eachEvent.key)} onClick={() => this.showDeleteMessage(eachEvent.key)}  className="removeEventButton" icon={faTimesCircle}/>
                                                </div>
                                                {this.state.showDelete && this.state.idClicked === eachEvent.key ?
                                                    <div className="deleteEvent">
                                                        <div className="deleteEventQuestion">
                                                            <h5>Are you sure you want to delete this event:
                                                            <span>{eachEvent.eventDetails.name}?</span></h5>
                                                            <div className="deleteCancelButtons">
                                                                <button onClick={() => this.removeEvent(eachEvent.key)} >Delete</button>
                                                                <button onClick={() => this.cancelDelete()}>Cancel</button>
                                                            </div>
                                                        </div>
                                                    </div> 
                                                : null}
                                                <li><h3>{eachEvent.eventDetails.name}</h3></li>
                                                <li>Party Size: {eachEvent.eventDetails.partySize}</li>
                                                <li>Type: {eachEvent.eventDetails.type}</li>
                                            </div>
                                        </ul>
                                    </label>
                                </fieldset>
                            )
                        })}
                        <fieldset>
                            <button onClick={this.handleClick} className="createNewButton">Add New Event<div className="newIcon" aria-hidden="true"><FontAwesomeIcon icon={faFileAlt} size="3x"/></div></button>
                        </fieldset>
                    </form>
                    {/* Link to Results Page */}
                    {/* Pass selected value and all firebase values to Results */}
                    {/* Add IF statement to force user to select one option */}
                    <div className="toResults">
                        {this.state.userInput ?
                            <Link to={{
                                pathname: `/results/${this.state.userInput}`,
                                state: {
                                    selectedEvent: this.state.userInput,
                                    allEvents: this.state.socialEvents
                                }
                            }}>Show me the Shows!</Link>
                            : <div><p className="defaultText">Please select your event!</p></div>
                        }
                        <div>
                            <p className="middleText">or</p>
                        </div>
                        <Link to={{
                            pathname: `/results/${this.state.randomEvent}`,
                            state: {
                                selectedEvent: this.state.randomEvent,
                                allEvents: this.state.socialEvents
                            }
                        }}>Random Event</Link>
                    </div>
                </section>}
            </div>
        );
    }
}

export default SocialEvents;
