import React, {PropTypes} from "react"
import {connect} from "react-redux"

export class ReplyBox extends React.Component {
    state = {
        text: "Your message here!"
    }

    updateText = (e) => {
        this.setState({text: e.target.value})
    }

    sendReply = () => {
        this.props.replyText(this.state.text)
        this.setState({text: ""})
    }

    render () {
        return (
            <div>
                <input value = {this.state.text} onChange={this.updateText}/>
                <button onClick={this.sendReply}>Send</button>
            </div>
        )
    }
}

ReplyBox.propTypes = {
    replyImage: PropTypes.func,
    replyText: PropTypes.func
}

export default connect(undefined, {
    replyText: (text) => ({
        type: "REPLY",
        apiEndpoint: "chatPOST",
        payload: {text}
    }),
    replyImage: (data) => ({
        type: "REPLY",
        apiEndpoint: "chatPOST",
        payload: {data}
    })
})(ReplyBox)
