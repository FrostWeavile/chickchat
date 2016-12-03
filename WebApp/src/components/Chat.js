import moment from "moment"
import React, {PropTypes} from "react"
import {connect} from "react-redux"
import ReplyBox from "./ReplyBox"

export class Chat extends React.Component {
    render () {
        return (
            <div style={rootStyle}>
                <ul style={ulStyle}>
                    {this.props.messages.map(renderMessage)}
                </ul>
                <ReplyBox/>
                {/* Exercise 2: Add a ReplyBox component */}

            </div>
        )
    }
}

function renderMessage (message) {
    return (
        <li key={message.messageId}>
          <img src =   {message.author.picture} height = "64" />

            {message.author.name + ":"}

            {getMessageBody(message)}
        </li>
    )
}

const ulStyle = {
    overflowY: "scroll",

    /* Exercise 4: Add your own styles */

}

const imageStyle = {
    maxWidth: "100px",
    maxHeight: "100px",
    objectFit: "contain"
}

const rootStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    height: "100%"
}

function getMessageDate (message) {
    return moment(message.timestampUtc).format("dddd, h:mm A")
}

function getMessageBody (message) {
    if (message.data) {
        return <img src={message.data} style={imageStyle} />
    } else {
        return message.text
    }
}

Chat.propTypes = {
    messages: PropTypes.array
}

function mapStateToProps (state) {
    return {
        messages: state.messages
    }
}

export default connect(
    mapStateToProps
)(Chat)
