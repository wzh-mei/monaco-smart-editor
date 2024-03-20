
import React from 'react';
import _ from 'lodash';
import Editor from "@monaco-editor/react";

class InnerCJSEditorV3 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code: (props.code) ? props.code : "",
            selectedCode: (props.commentCode) ? props.commentCode : "",
        }
        this.editor = null;
        this.monaco = null;
    }

    componentDidMount() {
        try {
            // Attach event listener to the window object
            window.addEventListener('keydown', this.handleKeyDown);

            var self = this;
            if (this.props.code) {
                this.setState({ code: this.props.code });
            }

            if (this.props.theme) {
                if (_.indexOf(["vs", "vs-dark", "hc-black"], this.props.theme) < 0) {
                    getThemeData(this.props.theme).then(function (themeData) {
                        self.monaco.editor.defineTheme(self.props.theme, themeData);
                        self.monaco.editor.setTheme(self.props.theme);
                    }).catch(function (err) {
                        console.log("failed to set theme data:" + err);
                    });
                }
            }
        } catch (err) {
            console.error("An error occurred in componentDidMount: ", err);
        }
    }
    componentWillUnmount() {
        // Remove the event listener when the component is unmounted
        window.removeEventListener('keydown', this.handleKeyDown);

        // Dispose the editor to avoid memory leaks
        if (this.editor) {
            this.editor.dispose();
        }
      }
      handleKeyDown = (event) => {
        // Check for the specific hotkeys you want to block
        if (event.ctrlKey && event.key === 'r') {
          // Block the default behavior for Ctrl+R (reload)
          event.preventDefault();
          this.props.onHotKeys.refresh()
        }
    
        if (event.ctrlKey && event.key === 's') {
          // Block the default behavior for Ctrl+S (save)
          event.preventDefault();
          this.props.onHotKeys.save()
        }
        if (event.ctrlKey && event.key === 'e') {
          event.preventDefault();
          this.props.onHotKeys.AITool()
        }
      };

    editorDidMount = (editor, monaco) => {
        console.log('V3 editor mounted', editor);
        this.editor = editor;
        this.monaco = monaco;

        this.selectCommentCode()

        if (this.props.editorDidMount) {
            this.props.editorDidMount(editor, monaco);
        }
        if (this.props.onHotKeys) {
        }
        editor.focus();

        if (this.props.forwardedRef) {
            this.props.forwardedRef.current = {
                revealLineInCenter: this.editor.revealLineInCenter.bind(this.editor),
                deltaDecorations: this.editor.deltaDecorations.bind(this.editor)
            }
        }
    }

    // selectCommentCode = () =>{
    //      this.editor.onDidChangeCursorPosition((event) => {
    //         const lineNumber = event.position.lineNumber;
    //         const lineContent = this.editor.getModel().getLineContent(lineNumber);
    //         if (this.isComment(lineContent)) {
    //             this.props.util.setCommentCode(lineContent);
    //         } else {
    //             this.props.util.setCommentCode("");
    //         }
    //     });
    // }

    selectCommentCode = () => {
        console.log("select triggered!")
        this.editor.onDidChangeCursorPosition((event) => {
            const selection = this.editor.getSelection();
            const selectedCode = this.editor.getModel().getValueInRange(selection);
            this.props.util.setCommentCode(selectedCode)
        });
    }

    onChange = (newValue, e) => {
        if (this.props.onChange) {
            this.props.onChange(newValue, e);
        }
    }

    getThemeOptions = () => {
        return themeMaps;
    }

    revealLineInCenter = (lineNumber) => {
        if (this.editor) {
            this.editor.revealLineInCenter(lineNumber);
        }
    }

    deltaDecorations = (oldDecorations, newDecorations) => {
        if (this.editor) {
            return this.editor.deltaDecorations(oldDecorations, newDecorations);
        }
        return [];
    }

    render() {
        //const code = this.state.code; 
        const defaultOptions = {
            selectOnLineNumbers: true,
            quickSuggestions: true,
            typescript: {
                suggest: {
                    enabled: true
                },
                validate: {
                    enable: true
                }
            },
            formatOnType: true,
            formatOnPaste: true,
            wordWrap: "on",
        };

        return (
            <div ref={this.props.forwardedRef}>
                <Editor
                    {...this.props}
                    width="100%"
                    height="70vh"
                    theme="vs-dark" //{(this.props.theme) ? this.props.theme : "vs-dark"}
                    value={this.props.code}
                    options={_.extend(defaultOptions, this.props.options)}
                    onChange={this.onChange}
                    onMount={this.editorDidMount}
                />
            </div>
        );  
    }
}

const CJSEditorV3 = React.forwardRef((props, ref) => (
    <InnerCJSEditorV3 {...props} forwardedRef={ref} />
));


export default CJSEditorV3;