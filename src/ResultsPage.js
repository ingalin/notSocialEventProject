import { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import image from "./sass/noImage.jpg";
import ScrollToTopOnMount from './ScrollToTopOnMount';


class ResultsPage extends Component {
    constructor() {
        super();
        this.state = {
            // Error messages
            errorMessage: '',
            showErrorMessage: false,
            // Movie List
            movieList: [],
            // Array that displays only the movies of genre selected
            movieDisplay: [],
            // Social Event 
            socialEvent: {},
            // genre
            defaultGenres: "All Genres",
            selectedGenre: {
                value: "All Genres",
                label: "All Genres"
            },
            availableGenres: null,
            loadCheck: false,
            noMoviesToShow: false
        }
    }

    //AXIOS call to get movie list
    componentDidMount() {
        // destructure and filter our selected social event object and update setState
        const { selectedEvent, allEvents } = this.props.location.state;
        const filteredEvent = allEvents.filter((socialEvent) => {
            return socialEvent.key === selectedEvent
        })
        this.setState({
            socialEvent: filteredEvent[0]
        }, () => {
                // check when data has finished loading
                this.setState({
                    loadCheck: true
                })
            // Do AXIOS call to get all the tv shows from Canada
            axios({
                method: "GET",
                // Replace the date with the event's date
                url: `https://api.tvmaze.com/schedule?date=${this.state.socialEvent.eventDetails.date}`,
                responseType: "json",
                params: {
                    country: "CA"
                }
            }).then((response) => {
                const canadianTV = response.data
                // axios call to get tv shows from the US
                axios({
                    method: "GET",
                    // Replace the date with the event's date
                    url: `https://api.tvmaze.com/schedule?date=${this.state.socialEvent.eventDetails.date}`,
                    responseType: "json",
                    params: {
                        country: "US"
                    }
                }).then((results) => {

                    // add the American TV shows to the end of the canadianTV array
                    const northAmericanTV = [...canadianTV, ...results.data];
                    this.setState({
                        movieList: northAmericanTV,
                        movieDisplay: northAmericanTV
                    }, () => {
                        if (northAmericanTV.length == 0)
                            this.setState({
                                noMoviesToShow: true
                            })
                        // Run the function to get all available genres on a particular day
                            this.getActiveGenresArray();
                    })
                })
            }).catch((err) => {
                // Show message if axios error
                this.setState({
                    errorMessage: err.message,
                    showErrorMessage: true,
                });
            });
        })
    }

    // Change the displayed data based on the genre chosen
    componentDidUpdate(prevProp, prevState) {

        if (prevState.selectedGenre !== this.state.selectedGenre) {

            // Show all movies if all genres selected, show only one genre if one genre is selected
            if (this.state.selectedGenre.value !== this.state.defaultGenres) {
                const filteredMovies = this.state.movieList.filter((movie) => {
                    const genreAvailArray = movie.show.genres.includes(this.state.selectedGenre.value)
                    return genreAvailArray;
                });
                this.setState({
                    movieDisplay: filteredMovies
                })
            } else {
                this.setState({
                    movieDisplay: this.state.movieList
                })
            }
        }
    }

    // Reload page button if AXIOS error
    reloadPage = () => {
        // REVIEW why is reload crossed out?
        window.location.reload();
    }

    // Handle change if selected genre changes 
    handleChange = (selectedGenre) => {
        this.setState({ selectedGenre });
    };

    // Get all genres which are available on the chosen date
    getActiveGenresArray = () => {
        let copyArray = [];
        const showList = this.state.movieList;
        showList.forEach( (show) => {
        copyArray.push(...show.show.genres);
        });
        // uses Set remove duplicate values from the array.
        // maps through the "leaned" array and formats each value into objects for the dropdown.
        // returns the mapped array and re-assigns it to copyArray. 
        copyArray = [...new Set(copyArray)].sort().map( (genre) => {
            return {
                value: genre,
                label: genre
            };
        })
        copyArray.unshift({
            value: this.state.defaultGenres,
            label: this.state.defaultGenres
        });
        this.setState({ 
            availableGenres: copyArray
        });
    }

    // Display data
    render() {
        // destructuring 
        const { selectedGenre, socialEvent, availableGenres } = this.state;

        return (
            <div>
                <ScrollToTopOnMount />
                {/* Show eror message if Axios call fails */ }
                {
                    this.state.showErrorMessage && <div className="blockView">
                        <div className="error wrapper">
                            <h6>Sorry... Something went wrong, not all data can be retrieved.</h6>
                            <button onClick={this.reloadPage}>Try again!</button>
                            <p>{this.state.errorMessage}</p>
                        </div>
                    </div>
                }
                <main className="resultsPage wrapper">
                    {/* use the selected event and display it on the page */}
                    <section className="missedEvent" id="missedEvent">
                        <div className="replacetEvent">
                            <h2>What You're Missing...</h2>
                            {this.state.loadCheck &&
                                <ul className="eachEvent">
                                    <div className="dateTwo">
                                        <li className="time">Time: {socialEvent.eventDetails.time}</li>
                                        <li className="dateInfo"><time dateTime={socialEvent.eventDetails.date}>{socialEvent.dayMonth}<span>  {socialEvent.year}</span></time></li>
                                    </div>
                                    <div className="styleGroupTwo">
                                        <li><h3>{socialEvent.eventDetails.name}</h3></li>
                                        <li>Party Size: {socialEvent.eventDetails.partySize}</li>
                                        <li>Type: {socialEvent.eventDetails.type}</li>
                                    </div>
                                </ul>
                            }
                        </div>
                        <div className="changeEvent">
                            <Link to="/">Pick Another Event</Link>
                        </div>
                    </section>
                    <section>
                        <h2>What You're Doing Instead:</h2>
                        {/* select genre */}
                        {!this.state.noMoviesToShow && 
                            <div className="selectGenre">
                                <h3>Pick Your Genre:</h3>
                                <Select
                                    value={selectedGenre}
                                    onChange={this.handleChange}
                                    options={availableGenres}
                                    className="genreDropdown"
                                    theme={theme => ({
                                        ...theme,
                                        borderRadius: 5,
                                        colors: {
                                            ...theme.colors,
                                            primary25: 'rgb(230, 227, 227)',
                                            primary: '#ef233c',
                                        }
                                    })}
                                />
                            </div>
                        }
                        {/* display tv show results on page */}
                        {/* TODO filter through tv shows */}
                        {/* If no shows, show an error message */}
                        {this.state.noMoviesToShow && <h4 className="noShowsMessage">Currently no TV Shows for this date. Please check back later or pick another event!</h4>}
                        <ul className="tvShows">
                            {
                                this.state.movieDisplay.map((movie) => {
                                    // Const for Official site link
                                    const showUrl = movie.show.officialSite;
                                    return (
                                        <li key={movie.id}>
                                            <div className="movieData"> 
                                                <img src={movie.show.image !== null ? movie.show.image.medium : image} alt={movie.show.image  !==null   ? movie.show.name : "No Image available"}/>
                                                <h3>{movie.show.name}</h3>
                                                <p>Episode: {movie.name}</p>
                                                <p>Airtime: {movie.airtime}</p>
                                                <p>{movie.show.network != null ? movie.show.network.country.name : 'Country Unvailable' }</p>
                                            </div>
                                            <div className="link">
                                            {
                                                showUrl ? <a href={showUrl} target="_blank" rel="noreferrer noopener">Go To Official Site</a> : <p className="notSelected">No Link Available</p>
                                            }
                                            </div>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                        {/* Start over button */}
                        <div className="btnContainer">
                            <Link to="/">Pick Another Event</Link>
                            {!this.state.noMoviesToShow && <a href="#missedEvent">Return to the top</a>}
                        </div>
                    </section>
                </main>
            </div>
        );
    }
}

export default ResultsPage;
