import React from 'react';

class SpecialCommonCode extends React.Component {

    /**
     * selectedValue
     * specialCode
     * placeHolder
     * firstSelectYn
     * @param {*} props 
     */
    constructor(props){
        super(props);    
        this.state = {
            Options : []
        }
    }  

    /**
     * 공통코드 조회
     */
    selectSpecialCommonCode = async () => {
        let url = `/api/code/${this.props.specialCode}/list`;
        const response = await fetch(url);        
        const body = await response.json();
        const codes = body.codes;
        return codes;
    }

    componentDidMount(){ 
        this.selectSpecialCommonCode()
        .then(res => {
            this.setState({ Options: res });
        })
        .catch(err => console.log(err));
    }   

    ifSelected = (option) => {
        /**
         * 비교대상인 슈퍼코드ID superCodeId 가 String 형식의 숫자로 넘어오므로 형변환하여 비교함.
         * 비교연산자를 === 로 할 경우 if문 실행안됨.
         */
        if(this.props.selectedValue == new String(option.key)){
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

export default SpecialCommonCode;