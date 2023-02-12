import React from "react";
import {withRouter} from "../../WithRouter";

class ErrorBoundary extends React.Component{
    static getDerivedStateFromError(error) {

    }

    componentDidCatch(error, errorInfo) {
        console.log('error');
        this.props.navigate('/error/internal');
    }

    render() {
        return this.props.children;
    }
}

export default withRouter(ErrorBoundary);