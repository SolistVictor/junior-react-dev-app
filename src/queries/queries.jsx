import { gql } from 'apollo-boost';

const layoutQuery = gql`
{
    categories{
        name
    }
    currencies{
        symbol
        label
    }
}
`

const cartQuery = gql`
{
    categories{
        products{
            id
            name
            gallery
            prices{
                currency{
                    symbol
                    label
                }
                amount
            }
            attributes{
                name
   			    items{
                    value
                }
            }
        }
    }
}
`

const categoryQuery = gql`
  query category($input: CategoryInput) {
    category(input: $input) {
      name
      products{
        id
        name
        inStock
        attributes{
          id
          name
          items{
            value
          } 
        }
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

const productIdQuery = gql`
  query product($id: String!) {
      product(id: $id){
        id
        name
        gallery
        description
        brand
        inStock
        attributes{
          id
          name
          items{
            value
          } 
        }
        prices{
          amount
          currency{
            symbol
          }
        }
      }
  }
`

export {layoutQuery, cartQuery, categoryQuery, productIdQuery};