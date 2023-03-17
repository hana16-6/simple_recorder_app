import React from "react";
import vmsg from "vmsg";
import recordImg from "../assets/icons/microphone-svgrepo-com.svg";
import pauseImg from "../assets/icons/wm-pause.png";
const recorder = new vmsg.Recorder({
  wasmURL: "https://unpkg.com/vmsg@0.3.0/vmsg.wasm",
});

class Recorder extends React.Component {
  state = {
    isLoading: false,
    isRecording: false,
    recordings: [],
  };
  record = async () => {
    this.setState({ isLoading: true });

    if (this.state.isRecording) {
      const blob = await recorder.stopRecording();
      this.setState({
        isLoading: false,
        isRecording: false,
        recordings: this.state.recordings.concat(URL.createObjectURL(blob)),
      });
    } else {
      try {
        await recorder.initAudio();
        await recorder.initWorker();
        recorder.startRecording();
        this.setState({ isLoading: false, isRecording: true });
      } catch (e) {
        console.error(e);
        this.setState({ isLoading: false });
      }
    }
  };
  render() {
    const { isLoading, isRecording, recordings } = this.state;
    return (
      <div className="record_container">
        <button disabled={isLoading}>
          {isRecording ? (
            <img onClick={this.record} src={pauseImg} alt="" />
          ) : (
            <img onClick={this.record} src={recordImg} alt="" />
          )}
        </button>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {recordings.map((url) => (
            <li key={url}>
              <audio style={{ marginBottom: "10px" }} src={url} controls />
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Recorder;
