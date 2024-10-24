import React, { Component } from 'react';
import './MainStyle.css';

class MainFile extends Component {
    constructor(){
        super();
        this.state={
            Days :'' , 
            Appearance:'',
            Smell :'',
            Message:'ENTER ALL THE VALUES !',
            Output:'ENTER YOUR VALUES ' , 
            AllValues: false,
            img:null,
            imgPreview: '' ,
            Result : 0 
        }
    }

    // API call to generate the result
    GenRes = async () => {
        const URL = "http://127.0.0.1:5000/api/TextAi";
        try {
            const response = await fetch(URL, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ days: this.state.Days, smell: this.state.Smell.toLowerCase(), spoilage: this.state.Spoilage.toLowerCase() }), 
            });

            const data = await response.json();
            if (data.result) {
                this.setState({ Output: `Result: ${data.result}` });
            } else if (data.error) {
                this.setState({ Output: `Error: ${data.error}` });
            }
        } catch (error) {
            console.error("Error generating result:", error);
            this.setState({ Output: "Error occurred during result generation." });
        }
    };


    setDays = (event) => {
        this.setState({
            Days: event.target.value
        });
    };

    setSpoilage = (event) => {
        this.setState({
            Spoilage: event.target.value
        });
    };

    setSmell = (event) => {
        this.setState({
            Smell: event.target.value
        });
    };

    CheckAllValues = () => {
        const present = this.state.Days && this.state.Smell && this.state.Spoilage;

        if (present) {
            this.setState({
                AllValues: true,
                Output: "GENERATING RESULT ..."
            }, this.GenRes); // Call GenRes if all values are present
        } else {
            this.setState({
                AllValues: false,
                Output: this.state.Message
            });
        }
    };

    setImage = (event) => {
        const file = event.target.files[0];
        if (file) {
            this.setState({
                img: file
            });

            const reader = new FileReader();
            reader.onloadend = () => {
                this.setState({ imgPreview: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    render() {
        return (
            <div className="main-box">
                <input 
                    type="text" 
                    className="days-box" 
                    value={this.state.Days} 
                    onChange={this.setDays} 
                    placeholder="ENTER DAYS SHELF LIFE"
                />
                <input 
                    type="text" 
                    className="smell-box" 
                    value={this.state.Smell} 
                    onChange={this.setSmell} 
                    placeholder="ENTER SMELL"
                />
                <input 
                    type="text" 
                    className="spoilage-box" 
                    value={this.state.Spoilage} 
                    onChange={this.setSpoilage} 
                    placeholder="ENTER APPEARANCE"
                />
                <div className="button-box">
                    <button 
                        onClick={this.  CheckAllValues} 
                        className="gen-button">
                        GENERATE RESULT
                    </button>
                </div>
                <input 
                    type="text" 
                    className="output-box" 
                    value={this.state.Output} 
                    readOnly 
                />
            </div>
        );
    }
}

export default MainFile;
