import React, {Component} from 'react';
import Layout from '../Layout/Layout';

export default class Home extends Component {
    constructor(props) {
        super(props);

        console.log(props);
    }

    render() {
        return (
            <Layout>
                Home
            </Layout>
        );
    }
}