import React from 'react';

class SuperCommonCode extends React.Component {

    constructor(props){
        super(props);    
        this.state = {
            Options : []
        }
    }  

    /**
     * 공통코드 조회
     */
    selectSuperCommonCode = async () => {
        let url = `/api/super/list`;
        const response = await fetch(url);        
        const body = await response.json();
        const superCodes = body.superCodes;
        return superCodes;
    }

    componentDidMount(){ 
        this.selectSuperCommonCode()
        .then(res => {
            this.setState({ Options: res });
            this.props.searchCodeOnlyOnetiem();
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

    render() {
        return (
        <>
            <option value="" disabled selected>슈퍼코드</option>
            { this.state.Options.map((option) => (
                this.ifSelected(option)
            )) }
          </>
        );
    }

}

export default SuperCommonCode;