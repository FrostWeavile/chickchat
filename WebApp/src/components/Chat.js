import moment from "moment"
import React, {PropTypes} from "react"
import {connect} from "react-redux"
import ReplyBox from "./ReplyBox"

export class Chat extends React.Component {
    render () {
        return (
            <div style={rootStyle}>
                <ul style={ulStyle} ref="messages">
                    {this.props.messages.map(renderMessage)}
                </ul>
                <ReplyBox/>
                {/* Exercise 2: Add a ReplyBox component */}

            </div>
        )
    }

    componentDidUpdate (prevProps) {
        if (prevProps.messages.length === this.props.messages.length) {
            return
        }

        const element = this.refs.messages
        if (element) {
            element.scrollTop = element.scrollHeight
        }
    }
}

function renderMessage (message) {
    return (
        <li style={{backgroundColor: "lightgreen", margin: 0, wordBreak: "break-all"}} key={message.messageId}>


          <img src =   {message.author.picture} style={{borderRadius: "50%"}} height = "64" />
            {message.author.name + ": "}

            {getMessageBody(message)}
        </li>
    )
}

const ulStyle = {
    overflowY: "scroll",
    listStyle: "none",
    paddingLeft: 0,
    paddingUps: 0
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
    height: "100%",
}

function getMessageDate (message) {
    return moment(message.timestampUtc).format("dddd, h:mm A")
}

function getMessageBody (message) {
    if (message.data) {
        return <img src={message.data} style={imageStyle} />
    } else {
        return(
        <span style={{ fontFamily: "Courier", color:"#071907"}}>
        {message.text}
        </span>
      )
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
