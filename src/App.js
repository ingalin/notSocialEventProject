import { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import SocialEvents from './SocialEvents.js';
import ResultsPage from './ResultsPage.js';
import Header from './Header.js';
import Footer from './Footer.js';
import './sass/App.scss';


class App extends Component {

  // Display data
  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <div className="App">
          <Route path="/" component={Header} />
          <Route exact path="/" component={SocialEvents} />
          <Route path="/results/:key" component={ResultsPage} />
          <Route path="/" component={Footer} />
        </div>
      </Router>
    );
  }
}
export default App;
