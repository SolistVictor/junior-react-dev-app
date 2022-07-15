import { Query } from 'react-apollo';
import React, { Component } from 'react';
import Category from '../components/Category';
import { Context } from '../context/Context';
import {categoryQuery} from '../queries/queries';




class CategoryPage extends Component {


  static contextType = Context;


  render() {
    return (
      <Query query={categoryQuery} variables={{ input: {title:  window.location.href.substring(22)} }}> 

        {({ data, loading }) => {
          if (loading) return <p>Loading…</p>;
          return (
            <div>
               <Category data={data} />
            </div>
          );
        }}
      </Query>

    );
  }
}


export default CategoryPage;


