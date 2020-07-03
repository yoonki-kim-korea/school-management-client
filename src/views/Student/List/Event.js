import React from 'react';

/**
 * 재학생관리
 * 학생 추가 후 화면에서 목록에 조회되도록 하기 위함
 */
class Event extends React.Component {

    constructor(props){
        super(props);    
    }

    componentDidMount(){ 
        if(!!this.props.studentId){
           this.props.search(this.props.studentId);
        }        
    }

    render() {
        return (
            <>
           
            </>
        );
    }
}

export default Event;