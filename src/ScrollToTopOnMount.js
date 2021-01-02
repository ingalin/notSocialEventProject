import { Component } from 'react';

class ScrollToTopOnMount extends Component {
  // Show the start of the page when going to the next page
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return null;
  }
}

export default ScrollToTopOnMount;
