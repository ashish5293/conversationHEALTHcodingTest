import React, { Component } from 'react';
import styles from '../scss/LoaderStyles.module.scss';

class LoaderComponent extends Component {
  render() {
    return (
      <div className={styles.loader}>
        Loading...
      </div>
    );
  }
}

export default LoaderComponent;
