import React, {Component} from 'react'
import {Button} from 'react-bootstrap'
import io from 'socket.io-client'
const moment = require('moment')
import {AiFillWechat, AiOutlineSend} from 'react-icons/ai'
const socket = io.connect(window.location.origin)

export default class Chatroom extends Component {
  constructor(props) {
    super(props)
    this.state = {
      message: '',
      messages: [],
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    //joins a room
    socket.emit(
      'join_chat',
      {
        message: `${this.props.user.name} has joined the room.`,
        name: `${this.props.user.name}`,
        timestamp: moment().format('h:mm a'),
      },
      this.props.room.name
    )

    //LISTENS FOR NEW MESSAGE
    socket.on('send_message', (message) => {
      this.setState((prevState) => {
        const {messages} = prevState
        messages.push(message)
        return messages
      })
    })

    //server sends a message
    socket.on('chat_joined', (message) => {
      this.setState((prevState) => {
        const {messages} = prevState
        messages.push(message)
        return messages
      })
    })
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleSubmit(event) {
    event.preventDefault()
    //EMITING A MESSAGE
    socket.emit(
      'chat_message',
      {
        message: event.currentTarget.message.value,
        name: this.props.user.name,
        timestamp: moment().format('h:mm a'),
      },
      this.props.room.name
    )
    this.setState({
      message: '',
    })
  }

  render() {
    return (
      <div className="chat-container">
        <header className="chat-header">
          <h1>
            <i>
              <AiFillWechat /> Chat
            </i>
          </h1>
        </header>
        <main className="chat-main">
          <div className="chat-sidebar">
            <h3>Current Artist:</h3>
            {this.props.inRoom.map((user) => {
              if (user.isArtist) {
                return (
                  <h2 id="artist-name" key={user.id}>
                    {user.name}
                  </h2>
                )
              }
            })}

            <h3>Users:</h3>
            <ul>
              {this.props.inRoom.map((user) => {
                return <li key={user.id}>{user.name}</li>
              })}
            </ul>
          </div>
          <div className="chat-messages">
            {this.state.messages.map((message, index) => (
              <div className="message" key={index}>
                <p className="meta">
                  {message.name} <span>{message.timestamp}</span>
                </p>
                <p className="text">{message.message}</p>
              </div>
            ))}
          </div>
        </main>
        <div className="chat-form-container">
          <form id="chat-form" onSubmit={this.handleSubmit}>
            <input
              name="message"
              type="text"
              placeholder="Enter Message"
              value={this.state.message}
              onChange={this.handleChange}
            />
            <Button type="submit" variant="outline-success">
              Send <AiOutlineSend />
            </Button>
          </form>
        </div>
      </div>
    )
  }
}