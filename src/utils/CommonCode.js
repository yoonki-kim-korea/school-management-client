import React from 'react';

class CommonCode extends React.Component {

    constructor(props){
        super(props);    
        this.state = {
            Options : []
        }
    }  

    /**
     * 공통코드 조회
     */
    selectCommonCode = async (superCode) => {
        let url = `/api/code/list?superCode=${superCode}`;
        const response = await fetch(url);        
        const body = await response.json();
        const codes = body.codes;
        return codes;
    }

    componentDidMount(){ 
        this.selectCommonCode(this.props.superCode)
        .then(res => this.setState({ Options: res }))
        .catch(err => console.log(err));
    }

    ifSelected = (option) => {
        if(this.props.selectedValue === option.key){
            return <option key={option.key} value={option.key} selected>{option.value}</option>;
        } else {
            return <option key={option.key} value={option.key} >{option.value}</option>;
        }
    } 
    
    firstElement = () =>{
        if(this.props.firstSelectYn === "Y"){
            if(!!this.props.selectedValue){
                return <option value=""  >{this.props.placeHolder}</option>;
            }else{
                return <option value=""  selected>{this.props.placeHolder}</option>;
            }
        }else{
            if(!!this.props.selectedValue){
                return <option value=""  disabled >{this.props.placeHolder}</option>;
            }else{
                return <option value=""  disabled selected>{this.props.placeHolder}</option>;
            }
        }
    }

    render() {
        return (
        <>
            {this.firstElement()}
            { this.state.Options.map((option) => (
                this.ifSelected(option)
            )) }
          </>
        );
    }
}

export default CommonCode;