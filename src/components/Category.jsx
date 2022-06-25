import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Context } from '../context/Context';
import './Category.css';
import circleIcon from '../assets/icons/Circle_Icon.png';




class Category extends Component {
    constructor(props) {
        super(props)

    }

    static contextType = Context;

    displayCategory = () => {
        let data = this.props.data;
        let currencyIndex = this.context.state.currencyId;
        if (data.loading) {
            return <div>Loading...</div>
        }
        else {
            let index;
            if (this.context.state.categoryName === 'all') {
                index = 0;
            }
            else if (this.context.state.categoryName === 'clothes') {
                index = 1;
            }
            else if (this.context.state.categoryName === 'tech') {
                index = 2;
            }
            return (
                <div>
                    <h1 style={{ margin: '3rem 0', fontSize: '3rem', textTransform: 'uppercase' }}>
                        {data.categories[index].name}
                    </h1>
                    <div className='category_products'>
                        {data.categories[index].products.map((product, id) =>
                            <div key={id} className='categoty_product'>
                                <button className='btn_product_img'>
                                    <Link onClick={(e) => {
                                        if (!product.inStock) { e.preventDefault() }
                                        }}
                                        to={`/product/${product.id}`}>

                                        <img className={product.inStock ? 'category_product_img' : 'category_outOfStock_product_img'}
                                            src={product.gallery[0]} alt="no image" />
                                        
                                        <img className='circleIcon' src={circleIcon} alt={circleIcon} />

                                        {product.inStock ? null : <p className='p_outOfStock'>Out of stock</p>}
                                    </Link>
                                </button>

                                <p className={product.inStock ? null : 'p_productName_outOfStock'}>
                                    {product.name}
                                </p>
                                <p className={product.inStock ? 'category_product_price' : 'category_product_price_outOfStock'}>
                                    {product.prices[currencyIndex].currency.symbol}{product.prices[currencyIndex].amount}
                                </p>
                            </div>
                        )}
                    </div>
                </div>)
        }
    }

    render() {
        return (
            <div>
                {this.displayCategory()}
            </div>
        );
    }
}


export default Category;
