import React from 'react';

class Event extends React.Component {

    constructor(props){
        super(props);    
    }

    componentDidMount(){ 
        if(!!this.props.teacherId){
           this.props.search(this.props.teacherId);
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