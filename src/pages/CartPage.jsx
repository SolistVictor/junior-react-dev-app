import React, { Component } from 'react';
import Cart from '../components/Cart';
import { graphql } from 'react-apollo';
import './cartPage.css';
import {cartQuery} from '../queries/queries';





class CartPage extends Component {

    render() {
        return (
            <div >
                <h1 className='cart_header'>Cart</h1>
                <Cart data={this.props.data} />
            </div>
        );
    }
}

export default graphql(cartQuery)(CartPage);
