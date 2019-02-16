import React, { Component, PropTypes } from 'react';

const { string, number } = PropTypes;

export default class IconMerge extends Component {
  static propTypes = {
    size: number.isRequired,
    color: string,
  };

  render() {
    const { props: { size, color, ...props } } = this;

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1024 1024"
        width={size}
        height={size}
        fill="inherit"
        {...props}
      >
        <path
          fill={color || 'inherit'}
          d="M704 576v224l288-288-288-288v224h-229.504l-381.248-381.248-90.496 90.496 418.752 418.752z"
        />
        <path
          fill={color || 'inherit'}
          d="M258.752 546.752l90.496 90.496-256 256-90.496-90.496 256-256z"
        />
      </svg>
    );
  }
}
