import React from "react";
import MonacoEditor from "@monaco-editor/react";

class CodeEditor extends React.Component {
  options = {
    selectOnLineNumbers: true,
    quickSuggestions: true,
    typescript: {
      suggest: {
        enabled: true,
      },
      validate: {
        enable: true,
      },
    },
    formatOnType: true, // Enable Prettier formatting on type
    formatOnPaste: true, // Enable Prettier formatting on paste
    wordWrap: "on", // Enable word wrap for better formatting
    automaticLayout: true, // Enable automatic layout adjustment
    lineNumbersMinChars: 3, // Set the minimum number of characters to display for line numbers
    scrollbar: {
      alwaysConsumeMouseWheel: false, // Allow the page to scroll when the mouse wheel is over the editor
    },
  };

  handleEditorDidMount = (editor, monaco) => {
    console.log("Editor mounted:", editor);
    this.props.forwardedRef.current = editor;
    if (this.props.onEditorReady) {
      this.props.onEditorReady(editor, monaco);
    }
  };
  // handleFormatClick = async() => {
  //   const { code, onCodeChange } = this.props;

  //   try {
  //     const formattedCode =await prettier.format(code, {
  //       parser: "babel",
  //       singleQuote: true,
  //       trailingComma: "es5",
  //     });
  //     onCodeChange(formattedCode);
  //   } catch (error) {
  //     console.error("Error formatting code:", error);
  //   }
  // };
  render() {
    return (
      <div>
        <button onClick={this.handleFormatClick}>Format Code</button>
        <MonacoEditor
          width="100%"
          height="70vh"
          language="javascript"
          theme="vs-dark"
          value={this.props.code}
          options={this.options}
          onChange={this.props.onCodeChange}
          onMount={this.handleEditorDidMount}
        />
      </div>
    );
  }
}

export default CodeEditor;
