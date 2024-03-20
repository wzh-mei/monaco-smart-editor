import React, { Component } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from '@chatscope/chat-ui-kit-react';

const API_KEY = "";

class ChatAPI extends Component {
  constructor(props) {
    super(props);
    this.state = {
    messages: [
        {
          message: "Hello, I'm ChatGPT! Ask me anything!",
          sentTime: "just now",
          sender: "ChatGPT",
        },
      ],
      isTyping: false,
    };
  }
  componentDidMount() {
    console.log("ChatAPI mounted");
  }

  componentDidUpdate = (prevProps) => {
    this.isCommentOnly(this.props.selectedCode) ? console.log("true"):console.log("false");
    if ( this.props.dialog !== prevProps.dialog && this.props.dialog && this.props.selectedCode) {
        console.log("trigger code generation")
      this.handleHotkeyRequest();
    }
  };

  isCommentOnly = (lineContent) => {
    const jsCommentRegex = /^\s*\/\/.*|^\s*\/\*.*\*\//;
    const htmlCommentRegex = /^\s*<!--.*-->/;
    const cssCommentRegex = /^\s*\/\*.*\*\//;

    // Check if the lineContent contains only comments
    const containsOnlyComments =
        jsCommentRegex.test(lineContent) ||
        htmlCommentRegex.test(lineContent) ||
        cssCommentRegex.test(lineContent);

    // Check if the lineContent contains any non-comment text
    const containsNonCommentText = /\S/.test(lineContent);

    // Return true if it contains only comments and no non-comment text
    return containsOnlyComments && !containsNonCommentText;
}

  handleHotkeyRequest = async () =>{
    const { messages } = this.state;
    this.setState({ messages: [...messages, {message:"Execute this command",direction: 'outgoing', sender: "user",}], isTyping: true });

    try {
        const response = await this.processMessageToChatGPT([messages]);
        const content = response.choices[0]?.message?.content;

        if (content) {
          const chatGPTResponse = {
            message: content,
            sender: "ChatGPT",
          };

          this.setState({ messages: [...messages, chatGPTResponse] });
        }
      } catch (error) {
        console.error("Error processing message:", error);
      } finally {
        this.setState({ isTyping: false });
      }

  }
  handleSendRequest = async (message) => {
    const { messages } = this.state;

    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user",
    };

    this.setState({ messages: [...messages, newMessage], isTyping: true });

    try {
      const response = await this.processMessageToChatGPT([...messages, newMessage]);
      const content = response.choices[0]?.message?.content;

      if (content) {
        const chatGPTResponse = {
          message: content,
          sender: "ChatGPT",
        };

        this.setState({ messages: [...messages, chatGPTResponse] });
      }
    } catch (error) {
      console.error("Error processing message:", error);
    } finally {
      this.setState({ isTyping: false });
    }
  };

  processMessageToChatGPT = async (chatMessages) => {
    console.log("Request sent");
    const apiMessages = chatMessages.map((messageObject) => {
      const role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
      return { role, content: messageObject.message };
    });
    console.log("apiMessages:",apiMessages)
    const apiRequestBody = {
        "model": "gpt-3.5-turbo",
        "temperature": 1,
        "max_tokens": 256,
        "top_p": 1,
        "frequency_penalty": 0,
        "presence_penalty": 0
    }
    const apiChatBody = {
        ...apiRequestBody,
      "messages": [
        {role: "system", content: `You are a React.js developer using this codebase:${this.props.code}` },
            ...apiMessages,
          ],
    };
    const apiGenerateBody = {
        ...apiRequestBody,
        "messages": [
          {role: "system", content: `You are a React.js developer using this codebase:${this.props.code} edit the code base the perform this task:${this.props.selectedCode}` },
            ],
    }
    const apiDocumentBody={
        ...apiRequestBody,
        "messages": [
            {role: "system", content: `You are a React.js developer using this codebase:${this.props.code}.Add documentation to this code section:${this.props.selectedCode}` },
              ],
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.props.selectedCode ? apiGenerateBody : apiChatBody),
    });
    return response.json();
  };

  render() {
    const { messages, isTyping } = this.state;

    return (
      <div className="App">
        {/* <div style={{ position: "relative", height: "800px", width: "700px" }}> */}
        <div style={{ position: "relative",height:"85vh" }}>
          <MainContainer>
            <ChatContainer>
              <MessageList
                scrollBehavior="smooth"
                typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}
              >
                {messages.map((message, i) => {
                  console.log(message);
                  return <Message key={i} model={message} />;
                })}
              </MessageList>
              <MessageInput placeholder="Send a Message" onSend={this.handleSendRequest} />
            </ChatContainer>
          </MainContainer>
        </div>
      </div>
    );
  }
}

export default ChatAPI;
