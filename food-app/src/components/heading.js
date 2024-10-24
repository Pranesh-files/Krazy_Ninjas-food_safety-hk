import React, { Component } from 'react'
import './HeadingStyle.css'
class HeadingFunc extends Component {
  constructor(props){
    super(props)
    this.state={
        heading: this.props.title
    }
  }
  render() {
    return (
      <div className = "title">
        {this.state.heading}
      </div>
    )
  }
}

export default HeadingFunc
