import React, { Component } from 'react';
import styles from '../scss/LoaderStyles.module.scss';

class LoaderComponent extends Component {
  render() {
    return (
      <div className={styles.loader}>
        {/* You can use any loader animation or an image here */}
        Loading...
      </div>
    );
  }
}

export default LoaderComponent;
