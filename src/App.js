import React from "react";
import CJSEditorV3 from "./cjsEditor";
import ChatAPI from "./chatAPI"

import Drawer from "@material-ui/core/Drawer";
import IconButton from '@material-ui/core/IconButton';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Divider from '@material-ui/core/Divider';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      code: "",
      selectedCode: "",
      AIToolDialog: false,
      disabledLines: [],
      decorations: [],
    };
    this.editorRef = React.createRef();
    this.monacoRef = React.createRef();
    // Bind the method to the current instance of the component
    this.handleCodeChange = this.handleCodeChange.bind(this);
    this.setCode = this.setCode.bind(this);
    this.setCommentCode = this.setCommentCode.bind(this);
  }

  componentDidMount() {
    console.log("App mounted");
  }

  componentWillUnmount() {
    console.log("App unmounted");
  }

  setCode = (newCode) => {
    this.setState({
      code: newCode,
    }, () => console.log("code:", this.state.code));
  };

  setCommentCode = (newCode) => {
    this.setState({
      selectedCode: newCode,
    }, () => console.log("selectedCode:", this.state.selectedCode));
  };

  handleCodeChange(newValue) {
    this.setCode(newValue);
  }

  handleEditorReady(editor, monaco) {
    this.editorRef.current = editor;
    this.monacoRef.current = monaco;
  }

  test() {
    alert("Testing...");
  }

  AITool = () => {
    this.setState((prevState) => ({
      AIToolDialog: !prevState.AIToolDialog,
    }));
  };

  render() {
    const { code, selectedCode, disabledLines, AIToolDialog } = this.state;
    const editorOptions = {
      styles: {
        '.error-line': {
          backgroundColor: 'rgba(255,255,255,0.5)',
          color: '#000',
        },
      },
      formatOnType: true,
      formatOnPaste: true,
      wordWrap: 'on',
    };

    return (
      <div className="App">
        <CJSEditorV3
          language="javascript"
          code={code}
          commentCode={selectedCode}
          options={editorOptions}
          onChange={this.handleCodeChange}
          editorDidMount={(editor, monaco) => {
            this.editor = editor;
            this.monaco = monaco;
          }}
          onHotKeys={{
            save: this.test,
            refresh: this.test,
            AITool: this.AITool,
          }}
          util={{
            setCommentCode: this.setCommentCode
          }}
        />

        <Drawer variant="persistent" anchor="right" open={AIToolDialog} onClose={this.AITool}>
          <div style={{ width: '450px', padding: '16px' }}>
            <div>
              <IconButton onClick={this.AITool}>
                {/* <ChevronLeftIcon /> */}
                <ChevronRightIcon />
              </IconButton>
              AI Assistant
            </div>
            <Divider />
            <ChatAPI 
              dialog={AIToolDialog}
              code={code}
              selectedCode={selectedCode}
            />
          </div>
        </Drawer>
      </div>
    );
  }
}

export default App;
