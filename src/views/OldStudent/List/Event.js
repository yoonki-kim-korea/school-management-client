import React from 'react';

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