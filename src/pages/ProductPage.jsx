import React, { Component } from 'react';
import Product from '../components/Product';
import { Query } from 'react-apollo';
import {productIdQuery} from '../queries/queries';




class Productpage extends Component {
 
  state = {
    id: window.location.href.substring(30)
  }

  render() {
    return (
      <Query query={productIdQuery} fetchPolicy='network-only' variables={{ id: this.state.id }}>

        {({ data, loading }) => {
          if (loading) return <p>Loading…</p>;
          
          return (
            <div>
              <Product data={data} />
            </div>
          );
        }}
      </Query>

    );
  }
}

export default Productpage;
