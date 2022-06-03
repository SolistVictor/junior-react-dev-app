import { gql } from 'apollo-boost';
import { graphql } from 'react-apollo';
import React, { Component } from 'react';
import Category from '../components/Category';


const query = gql`
{
    categories{
        name
        products{
          id
          name
          inStock
          prices{
            currency{
              label
              symbol
            }
            amount
          }
          gallery
        }
    }
}
`

class CategoryPage extends Component {


    render() {
        return (
            <div>
                <Category data={this.props.data} />
            </div>
        );
    }
}


export default graphql(query)(CategoryPage);


